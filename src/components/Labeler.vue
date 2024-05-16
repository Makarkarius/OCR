<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { fabric } from 'fabric'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useMainStore } from '@/stores/main'
import { useRoute } from 'vue-router'
import { mdiTrashCanOutline } from '@mdi/js'
import { documentTypes } from '@/config'
import { useNotificationsStore } from '@/stores/notifications'

const mainStore = useMainStore()
const notificationsStore = useNotificationsStore()

const route = useRoute()

const labelsData = defineModel('labels', {
  type: Object,
  required: true
})

const emit = defineEmits(['submit'])

const container = ref({})

const labels = ref([])

const labeler = ref({})

const isTemplate = computed(() => {
  return mainStore.document.type === documentTypes.template
})

const isEditable = computed(() => {
  if (mainStore.document.assessors.length === 0) {
    return true
  }
  return !!mainStore.document.assessors.find((assessor) => {
    return assessor.id === mainStore.user.id
  })
})

const templateLabelsNames = computed(() => {
  return mainStore.document.templateLabels.map((label) => {
    return label.labelName
  })
})

onMounted(async () => {
  try {
    await mainStore.document.fetch(route.params.id)
    const imageURL = mainStore.document.urlPath

    labeler.value = new Labeler(container.value)
    await labeler.value.loadImage(imageURL)

    if (labeler.value.resize) {
      window.addEventListener('resize', labeler.value.resize())
    }
  } catch (err) {
    notificationsStore.renderError(err)
  }
})

onUnmounted(async () => {
  if (labeler.value.resize) {
    window.removeEventListener('resize', labeler.value.resize())
  }
})

const submit = () => {
  const labelsList = []
  const image = labeler.value.image
  const scaleX = image.scaleX
  const scaleY = image.scaleY

  for (let i in labels.value) {
    const label = labels.value[i].canvasRect

    label.getPointByOrigin('left', 'top')
    labelsList.push({
      labelName: labels.value[i].labelName,
      x: (label.left - image.left) / scaleX,
      y: (label.top - image.top) / scaleY,
      width: label.width / image.scaleX,
      height: label.height / image.scaleY,
      rotate: label.angle
    })
  }
  labelsData.value = labelsList

  emit('submit')
}

const labelCounter = reactive({
  count: 0
})

const normalizeNumber = (val) => {
  return val === undefined ? 0 : val
}

const generateColor = () => {
  const allowed = '0369cf'.split('')
  let color = '#'
  while (color.length < 4) {
    color += allowed.splice(Math.floor((Math.random() * allowed.length)), 1)
  }
  return color
}

class Label {
  constructor(id, rect, text, color, labelName, description) {
    this.id = id
    this.canvasRect = rect
    this.canvasText = text
    this.color = color

    this.labelName = labelName
    this.description = description
    this.type = 'String'

    this.variant = ''
  }
}

class Labeler {
  constructor(container) {
    if (!container) throw 'err'
    this.container = container
    const canvasElm = document.createElement('canvas')
    container.appendChild(canvasElm)
    this.canvas = new fabric.Canvas(canvasElm)
    this.canvas.setBackgroundColor('rgb(219 234 254)')
    this.containerObserver = new ResizeObserver(this.resize.bind(this))
    this.containerObserver.observe(container)
    this.image = null
    labels.value = []
    this.registerCanvasEvents()
  }

  drawImage() {
    const image = this.image
    const canvas = this.canvas

    if (!image) {
      return
    }

    const maxSize = this.getContainerInnerSize()

    const prevLeft = image.left
    const prevTop = image.top

    canvas.setWidth(maxSize.width)
    canvas.setHeight(maxSize.height)

    this.image.center()

    const leftOffset = image.left - prevLeft
    const topOffset = image.top - prevTop

    labels.value.forEach((label) => {
      const labelObj = label.canvasRect
      labelObj.set({
        left: labelObj.left + leftOffset,
        top: labelObj.top + topOffset
      })
    })

    canvas.calcOffset()
    this.canvas.renderAll()
  }

  resize() {
    this.drawImage()
  }

  loadImage(src) {
    fabric.Image.fromURL(src, (img) => {
      this.image = img
      this.image.set('selectable', false)
      this.image.set('evented', false)
      const maxSize = this.getContainerInnerSize()
      const imageScale = this.getScaleImageInfo(
        normalizeNumber(this.image.width),
        normalizeNumber(this.image.height),
        maxSize.width,
        maxSize.height
      )
      this.image.set({
        scaleX: imageScale,
        scaleY: imageScale
      })
      this.canvas.add(this.image)

      this.drawImage()
      this.drawLabels()
    })
  }

  drawLabels() {
    const image = this.image
    const scaleX = this.image.scaleX
    const scaleY = this.image.scaleY
    mainStore.document.labels.forEach((label) => {
      const start = {
        x: image.left + label.x * scaleX,
        y: image.top + label.y * scaleY
      }
      const end = {
        x: image.left + (label.x + label.width) * scaleX,
        y: image.top + (label.y + label.height) * scaleY
      }

      this.addLabel(start, end, label.rotate, label.labelName)
    })
  }

  registerCanvasEvents() {
    const canvas = this.canvas

    canvas.on('custom:keydom', () => {
      this.removeLabel(canvas.getActiveObject())
    })

    // make container focusable, so that keydown event can be triggered.
    this.container.tabIndex = 1
    this.container.addEventListener('keydown', (e) => {
      if (!isEditable.value) {
        return
      }
      switch (e.key) {
        case 'Escape':
          canvas.fire('custom:keydom', e)
          return
        case ' ':
          this.isDragging = true
          return
      }
    })

    canvas.on('mouse:down', (event) => {
      if (event.e.altKey === true || this.isDragging) {
        this.isDragging = true
        canvas.selection = false
        this.lastPosX = event.e.clientX
        this.lastPosY = event.e.clientY
        return
      }

      if (!isEditable.value) {
        return
      }
      if (!event.target) {
        this.mouseStart = new fabric.Point(event.e.layerX, event.e.layerY)
        // disable all labels selection
        labels.value.forEach((label) => (label.canvasRect.selectable = false))
      } else {
        this.mouseStart = null
      }
    })

    canvas.on('mouse:up', (event) => {
      if (this.isDragging) {
        this.isDragging = false
        canvas.selection = true
        return
      }

      if (!isEditable.value) {
        return
      }
      // enable all labels selection
      labels.value.forEach((label) => (label.canvasRect.selectable = true))

      if (!this.mouseStart) {
        return
      }

      const mouseEnd = new fabric.Point(event.e.layerX, event.e.layerY)
      if (this.mouseStart.x === mouseEnd.x && this.mouseStart.y === mouseEnd.y) {
        return
      }

      if (Math.abs(this.mouseStart.x - mouseEnd.x) * Math.abs(this.mouseStart.y - mouseEnd.y) < 100) {
        return
      }

      const label = this.addLabel(this.mouseStart, mouseEnd)

      canvas.setActiveObject(label.canvasRect)
    })

    canvas.on('mouse:wheel', function(event) {
      const delta = event.e.deltaY
      let zoom = canvas.getZoom()
      zoom *= 0.999 ** delta
      if (zoom > 20) zoom = 20
      if (zoom < 0.1) zoom = 0.1
      canvas.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom)
      event.e.preventDefault()
      event.e.stopPropagation()
    })

    canvas.on('mouse:move', (opt) => {
      if (this.isDragging) {
        const e = opt.e
        const vpt = canvas.viewportTransform
        vpt[4] += e.clientX - this.lastPosX
        vpt[5] += e.clientY - this.lastPosY
        canvas.setViewportTransform(vpt)
        canvas.requestRenderAll()
        this.lastPosX = e.clientX
        this.lastPosY = e.clientY
      }
    })
  }

  addLabel(start, end, rotate = 0, labelName = '') {
    const canvas = this.canvas
    const zoom = canvas.getZoom()
    const qr = fabric.util.qrDecompose(canvas.viewportTransform)

    start.x = (start.x - qr.translateX) / zoom
    start.y = (start.y - qr.translateY) / zoom

    end.x = (end.x - qr.translateX) / zoom
    end.y = (end.y - qr.translateY) / zoom

    const color = generateColor()

    const id = '' + labelCounter.count++

    const rect = new fabric.Rect({
      id: id,
      originY: 'top',
      originX: 'left',
      left: Math.min(start.x, end.x),
      top: Math.min(start.y, end.y),
      angle: rotate,
      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y),
      stroke: color,
      strokeWidth: 2,
      fill: 'rgba(0,0,0,0.3)',
      cornerSize: 10,
      hasControls: isEditable.value,
      selectable: isEditable.value,
      evented: isEditable.value,
      cornerColor: color,
      borderColor: color,
      transparentCorners: false,
      centeredScaling: false,
      rx: 3,
      ry: 3
    })

    const coords = rect.getCoords(true)
    const text = new fabric.Text(id, {
      left: (Math.abs(coords[0].x + coords[1].x) + Math.abs(coords[2].x + coords[3].x)) / 4,
      top: (Math.abs(coords[0].y + coords[1].y) + Math.abs(coords[2].y + coords[3].y)) / 4,
      fontSize: 18,
      fill: color,
      originX: 'center',
      originY: 'center',
      selectable: false
    })

    const label = new Label(id, rect, text, color, labelName, '')
    labels.value.push(label)

    canvas.on('after:render', function() {
      const coords = rect.getCoords(true)
      text.set({
        left: (Math.abs(coords[0].x + coords[1].x) + Math.abs(coords[2].x + coords[3].x)) / 4,
        top: (Math.abs(coords[0].y + coords[1].y) + Math.abs(coords[2].y + coords[3].y)) / 4
      })
    })

    rect.on('modified', () => {
      this.adjustRectSizePosition(rect)
    })

    rect.on('removed', () => {
      canvas.remove(text)
    })

    canvas.add(rect)
    canvas.add(text)

    return label
  }

  removeLabel(rect) {
    if (!rect) {
      return
    }
    labels.value = labels.value.filter((label) => {
      return label.canvasRect.get('id') !== rect.get('id')
    })
    this.canvas.remove(rect)
  }

  adjustRectSizePosition(rect) {
    const minSize = 25

    let width = normalizeNumber(rect.width) * normalizeNumber(rect.scaleX)
    let height = normalizeNumber(rect.height) * normalizeNumber(rect.scaleY)
    let left = normalizeNumber(rect.left)
    let top = normalizeNumber(rect.top)

    const canvas = this.canvas
    const canvasWidth = normalizeNumber(canvas.width)
    const canvasHeight = normalizeNumber(canvas.height)

    if (left >= canvasWidth - minSize) {
      left = canvasWidth - minSize
    }
    // start y is out of bottom edge
    if (top >= canvasHeight - minSize) {
      top = canvasHeight - minSize
    }
    // end x is out of right edge
    if (left + width > canvasWidth) {
      width = canvasWidth - left
    }
    // end y is out of bottom edge;
    if (top + height > canvasHeight) {
      height = canvasHeight - top
    }
    // start x is out of left edge
    if (left < 0) {
      width += left
      left = 0
    }
    // start y is out of top edge
    if (top < 0) {
      height += top
      top = 0
    }
    // end x is out of left edge
    if (left + width < 0) {
      width = minSize
    }
    // end y is out of left edge
    if (top + height < 0) {
      height = minSize
    }
    rect.set({
      left: left,
      top: top,
      width: width,
      height: height,
      scaleX: 1,
      scaleY: 1
    })
    rect.setCoords()
  }

  getScaleImageInfo(imgWidth, imgHeight, maxWidth, maxHeight) {
    const wRatio = maxWidth / imgWidth
    const hRatio = maxHeight / imgHeight

    if (imgWidth > maxWidth && wRatio < hRatio) {
      return wRatio
    }
    if (imgHeight > maxHeight && hRatio < wRatio) {
      return hRatio
    }
    return Math.min(wRatio, hRatio)
  }

  getContainerInnerSize() {
    const container = this.container

    let height = container.clientHeight
    let width = container.clientWidth

    const paddingLeft = window.getComputedStyle(container, null).getPropertyValue('padding-left')
    const paddingRight = window.getComputedStyle(container, null).getPropertyValue('padding-right')
    const paddingTop = window.getComputedStyle(container, null).getPropertyValue('padding-top')
    const paddingBottom = window.getComputedStyle(container, null).getPropertyValue('padding-bottom')

    width = width - parseFloat(paddingLeft) - parseFloat(paddingRight)
    height = height - parseFloat(paddingTop) - parseFloat(paddingBottom)

    return {
      width,
      height
    }
  }
}

</script>

<template>
  <div class='max-h-modal h-full w-full justify-between'>
    <div class='flex flex-row gap-3 h-full w-full'>
      <div ref='container' class='basis-9/12 rounded-xl overflow-hidden border-blue-200 border-4' />

      <div class='basis-3/12 flex flex-col justify-between pt-1 bg-blue-100 rounded-xl border-blue-200 border-4'>
        <div class='overflow-y-scroll overflow relative max-h-modal flex flex-col gap-y-0'>
          <h3 class='font-bold text-xl text-center'>Labels</h3>
          <div v-for='label in labels' class='relative p-2 border-b-4 border-blue-200'>

            <div class='flex flex-row-reverse gap-1 h-4 w-full my-1 leading-none'>
              <BaseButton
                v-if='isEditable'
                :icon='mdiTrashCanOutline' class='size-4 cursor-pointer' as='div' color='danger' icon-size='.8rem'
                border='border-4 border-blue-200' small rounded-full
                @click='labeler.removeLabel(label.canvasRect)'
              />
              <div
                class='rounded-full w-4 h-4 border-[.01rem] border-black'
                :style='"background-color: " + label.color'
              />
              {{ label.id }}
            </div>

            <template v-if='isTemplate'>
              <FormField class='mb-[.5rem]'>
                <FormControl v-model='label.labelName' placeholder='Name' :disabled='!isEditable' />
                <FormControl v-model='label.description' placeholder='Description' :disabled='!isEditable' />
                <FormControl v-model='label.type' placeholder='Type' type='select' :disabled='!isEditable'
                             :options='isEditable ? ["String", "Number", "Date"] : [label.type]' />
              </FormField>
            </template>

            <template v-else>
              <FormField>
                <FormControl
                  type='select'
                  :options='templateLabelsNames'
                  v-model='label.labelName'
                  placeholder='Name'
                />
              </FormField>
            </template>

          </div>
        </div>

        <BaseButton
          v-if='isEditable'
          type='submit'
          color='info'
          label='save'
          @click='submit'
          class='rounded-md m-1 z-10' />
      </div>
    </div>
  </div>
</template>
