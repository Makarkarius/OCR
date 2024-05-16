export const chartColors = {
  default: {
    primary: '#00D1B2',
    info: '#209CEE',
    danger: '#FF3860',
    simple1: '#22e83f',
    simple2: '#e1f52c',
    simple3: '#ffb22e',
    simple4: '#ff6228',
    simple5: '#ff2727'
  }
}

export const randomChartColor = (idx = -1) => {
  const colors = Object.values(chartColors.default)
  if (idx >= 0) {
    return colors[idx % colors.length]
  }

  return colors[Math.round(Math.random() * 1e5) % colors.length]
}

const randomChartData = (n) => {
  const data = []

  for (let i = 0; i < n; i++) {
    data.push(Math.round(Math.random() * 200))
  }

  return data
}

export const datasetObject = (color, data, label = 'Data') => {
  return {
    fill: false,
    borderColor: chartColors.default[color],
    borderWidth: 2,
    borderDash: [],
    borderDashOffset: 0.0,
    pointBackgroundColor: chartColors.default[color],
    pointBorderColor: 'rgba(255,255,255,0)',
    pointHoverBackgroundColor: chartColors.default[color],
    pointBorderWidth: 20,
    pointHoverRadius: 4,
    pointHoverBorderWidth: 15,
    pointRadius: 4,
    data: data,
    label: label,
    tension: 0,
    cubicInterpolationMode: 'default'
  }
}

export const sampleChartData = (points = 10) => {
  const labels = []

  for (let i = 1; i <= points; i++) {
    labels.push(`0${i}`)
  }

  return {
    labels,
    datasets: [
      datasetObject('primary', randomChartData(points)),
      datasetObject('info', randomChartData(points)),
      datasetObject('danger', randomChartData(points))
    ]
  }
}
