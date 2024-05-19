import app from '../app'
import createElement from '../utils/createElement'

const container = document.querySelector('.container')
const nav = container.querySelector('nav')
const main = container.querySelector('main')
const startStopBtn = main.querySelector('[data-start-stop-btn]')
const timerOutput = main.querySelector('[data-timer-output]')

let timerIntervalId
let currentTimer = {
  hours: 0,
  minutes: 0,
  seconds: 0,
}

// Functions

const _formatTime = () => {
  let { seconds, minutes, hours } = { ...currentTimer }

  if (seconds < 10) {
    seconds = `0${seconds}`
  }
  if (minutes < 10) {
    minutes = `0${minutes}`
  }
  if (hours < 10) {
    hours = `0${hours}`
  }

  return `${hours}:${minutes}:${seconds}`
}

// Internal methods

const _updateTimer = () => {
  currentTimer.seconds += 1

  if (currentTimer.seconds >= 60) {
    currentTimer.seconds = 0
    currentTimer.minutes += 1
  }
  if (currentTimer.minutes >= 60) {
    currentTimer.minutes = 0
    currentTimer.hours += 1
  }

  timerOutput.innerHTML = _formatTime()
}

// DOM object

const DOM = {
  switchTimer() {
    const timerStatus = app.getTimerStatus()
    app.switchTimer()

    if (timerStatus.isActive) {
      startStopBtn.innerHTML = '>'
      clearInterval(timerIntervalId)
      currentTimer = { hours: 0, minutes: 0, seconds: 0 }
      timerOutput.innerHTML = '00:00:00'
      // TODO отобразить временной отрезок
      
    } else {
      startStopBtn.innerHTML = '||'

      timerIntervalId = setInterval(_updateTimer, 1000)
    }
  },
}

export default DOM
