<script setup>
import { onMounted, ref } from 'vue'
import { fabric } from 'fabric'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import axios from 'axios'
import { SERVER_URL } from '@/globals.js'
import BaseButton from '@/components/BaseButton.vue'

const mainStore = useMainStore()
const router = useRouter()
const route = useRoute()

const getDocument = async () => {
  try {
    let response = await axios
    .get(SERVER_URL + '/v1/document/' + route.params.id, {
      headers: {
        'Authorization': mainStore.user.token
      }
    })

    let imageURL = response?.data?.urlPath
    return imageURL
  } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
  }
}

const submit = () => {
  let labelsData = []
  const image = labeler.value.image

  for (let i in labels.value) {
    const label = labels.value[i].canvasObject
    labelsData.push({
      labelName: labels.value[i].name,
      x: label.left - image.left,
      y: label.top - image.top,
      width: label.width / image.scaleX,
      height: label.height / image.scaleY,
      rotate: label.angle
    })
  }

  const formData = {
    labels: labelsData,
    isLabeled: true,
    assessor: mainStore.user.email
  }

  axios
    .patch(SERVER_URL + '/v1/document/' + route.params.id, formData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': mainStore.user.token
      }
    })
    .then((result) => {
      console.log(result)
      router.push("/models")
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    })
}

function normalizeNumber(val) {
  return val === undefined ? 0 : val
}

class ImageLabel {
  constructor(rect, name, description) {
    this.canvasObject = rect
    this.name = name
    this.description = description
  }
}

class ImageLabeler {
  constructor(container) {
    if (!container) throw 'err'
    this.container = container
    const canvasElm = document.createElement('canvas')
    container.appendChild(canvasElm)
    this.canvas = new fabric.Canvas(canvasElm)
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
      const labelObj = label.canvasObject
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
      this.canvas.add(this.image)
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

      this.drawImage()
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
      switch (e.key) {
        case 'Escape':
          canvas.fire('custom:keydom', e)
          return
        case ' ':
          // console.log("space");
          return
      }
    })

    canvas.on('mouse:down', (event) => {
      if (event.e.altKey === true) {
        this.isDragging = true
        canvas.selection = false
        this.lastPosX = event.e.clientX
        this.lastPosY = event.e.clientY
        return
      }

      if (!event.target) {
        this.mouseStart = new fabric.Point(event.e.layerX, event.e.layerY)
        // disable all labels selection
        labels.value.forEach((label) => (label.canvasObject.selectable = false))
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

      // enable all labels selection
      labels.value.forEach((label) => (label.canvasObject.selectable = true))

      if (!this.mouseStart) {
        return
      }

      const mouseEnd = new fabric.Point(event.e.layerX, event.e.layerY)
      if (this.mouseStart.x === mouseEnd.x && this.mouseStart.y === mouseEnd.y) {
        return
      }

      if (
        Math.abs(this.mouseStart.x - mouseEnd.x) * Math.abs(this.mouseStart.y - mouseEnd.y) <
        100
      ) {
        return
      }

      const label = this.addLabel(this.mouseStart, mouseEnd)

      canvas.setActiveObject(label.canvasObject)
    })

    canvas.on('mouse:wheel', function (event) {
      var delta = event.e.deltaY
      var zoom = canvas.getZoom()
      zoom *= 0.999 ** delta
      if (zoom > 20) zoom = 20
      if (zoom < 0.1) zoom = 0.1
      canvas.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom)
      event.e.preventDefault()
      event.e.stopPropagation()
    })

    canvas.on('mouse:move', (opt) => {
      if (this.isDragging) {
        var e = opt.e
        var vpt = canvas.viewportTransform
        vpt[4] += e.clientX - this.lastPosX
        vpt[5] += e.clientY - this.lastPosY
        canvas.setViewportTransform(vpt)
        canvas.requestRenderAll()
        this.lastPosX = e.clientX
        this.lastPosY = e.clientY
      }
    })
  }

  addLabel(start, end) {
    const canvas = this.canvas
    var zoom = canvas.getZoom()
    const qr = fabric.util.qrDecompose(canvas.viewportTransform)

    start.x = (start.x - qr.translateX) / zoom
    start.y = (start.y - qr.translateY) / zoom

    end.x = (end.x - qr.translateX) / zoom
    end.y = (end.y - qr.translateY) / zoom

    const rect = new fabric.Rect({
      left: Math.min(start.x, end.x),
      top: Math.min(start.y, end.y),
      originX: 'left',
      originY: 'top',
      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y),
      hasRotatingPoint: false,
      stroke: 'red',
      strokeWidth: 1,
      fill: 'rgba(0,0,0,0.2)',
      cornerSize: 6,
      cornerStyle: 'circle',
      cornerColor: '#ff0000',
      borderColor: '#ff0000',
      transparentCorners: false,
      centeredScaling: false
    })

    rect.on('modified', () => {
      this.adjustRectSizePosition(rect)
    })
    canvas.add(rect)

    const label = new ImageLabel(rect, labels.value.length + '', '')
    labels.value.push(label)

    return label
  }

  removeLabel(object) {
    if (!object) {
      return
    }
    labels.value = labels.value.filter((lab) => lab.canvasObject === object)
    this.canvas.remove(object)
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
    // start x is out of right edge
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
    let scale = 1
    if (imgWidth > maxWidth && wRatio < hRatio) {
      scale = wRatio
    } else if (imgHeight > maxHeight && hRatio < wRatio) {
      scale = hRatio
    } else {
      scale = Math.min(wRatio, hRatio)
    }

    return scale
  }

  getContainerInnerSize() {
    const el = this.container
    let height = el.clientHeight
    let width = el.clientWidth
    const paddingLeft = window.getComputedStyle(el, null).getPropertyValue('padding-left')
    const paddingRight = window.getComputedStyle(el, null).getPropertyValue('padding-right')
    const paddingTop = window.getComputedStyle(el, null).getPropertyValue('padding-top')
    const paddingBottom = window.getComputedStyle(el, null).getPropertyValue('padding-bottom')
    width = width - parseFloat(paddingLeft) - parseFloat(paddingRight)
    height = height - parseFloat(paddingTop) - parseFloat(paddingBottom)

    return {
      width,
      height
    }
  }
}

const container = ref(null)

const labels = ref(null)

const labeler = ref(null)

onMounted(async () => {
  const imageURL = await getDocument()

  labeler.value = new ImageLabeler(container.value)
  labeler.value.loadImage(imageURL)
  window.addEventListener('resize', labeler.value.resize())
})
</script>

<template>
  <div class="flex flex-row max-h-modal h-full w-full justify-between">
    <div ref="container" class="basis-8/12 h-full w-full" />
    <div class="basis-3/12 overflow-scroll relative max-h-modal flex flex-col gap-y-6">
      <div v-for="label in labels">
        <FormField label="Name" class="mb-[-0rem]">
          <FormControl v-model="label.name" />
        </FormField>
        <FormField label="Description">
          <FormControl v-model="label.description" />
        </FormField>
      </div>
    </div>
  </div>

  <div>
    <BaseButton type="submit" color="info" label="save" @click="submit" />
  </div>
</template>

<style></style>
