import app from '../app'
import createElement from '../utils/createElement'

const container = document.querySelector('.container')
const main = container.querySelector('main')
const startStopBtn = main.querySelector('[data-start-stop-btn]')
const timerOutput = main.querySelector('[data-timer-output]')
const currentOccupationName = main.querySelector('[data-occupation-name]')
const occupationBtn = main.querySelector('[data-controls-occupation]')
const occupationsUl = main.querySelector('[data-occupations-list]')
const occModal = document.querySelector('[data-occupation-modal]')
const closeModalBtn = document.querySelector('[data-close-modal-btn]')
const timePeriodsContainer = main.querySelector('[data-time-segments]')

let { occupation } = app.getTimerStatus()
let timerIntervalId
let currentTimer = {
  hours: 0,
  minutes: 0,
  seconds: 0,
}

// Functions

const modalHandler = (Event, modalEl) => {
  const dialogDimensions = modalEl.getBoundingClientRect()
  if (
    Event.clientX < dialogDimensions.left ||
    Event.clientX > dialogDimensions.right ||
    Event.clientY < dialogDimensions.top ||
    Event.clientY > dialogDimensions.bottom
  ) {
    modalEl.close()
  }
}

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

const _showTimePeriods = () => {
  timePeriodsContainer.innerHTML = ''
  const activityList = app.getStorage().dayActivity
  activityList.forEach((period) => {
    const li = createElement('li')
    li.innerHTML = `
    <div time-segment class="bg-main-light rounded flex flex-wrap w-full  items-center p-3 shadow-grey-btn text-font-color">
              <div class="mr-12">
                <span data-begin-time>${period.start}</span>-<span data-end-time>${period.end}</span>
              </div>
              <span data-time-interval>${period.time}</span>
              <div class="flex items-center gap-2 ml-auto">
                <span data-occupation-name>${period.occupation.name}</span>
                <div
                  data-occupation
                  class="rounded-full size-7 border border-border-color">
                </div>
              </div>
            </div>`
    const occCircle = li.querySelector('[data-occupation]')
    occCircle.style.backgroundColor = period.occupation.color
    timePeriodsContainer.append(li)
  })
}

// DOM object

const DOM = {
  renderDOM() {
    occupationsUl.innerHTML = ''
    const storage = app.getStorage()
    storage.occupations.forEach((occ) => {
      const li = createElement('li', null, null, null, occ.name, [
        { dataKey: 'occupationType', dataValue: occ.name },
      ])
      li.addEventListener('click', (Event) => {
        const occName = Event.target.dataset.occupationType
        DOM.setOccupation(occName)
      })
      occupationsUl.appendChild(li)
    })
    occupationBtn.style.backgroundColor = occupation.color
    _showTimePeriods()
  },

  switchTimer() {
    const timerStatus = app.getTimerStatus()
    app.switchTimer()

    if (timerStatus.isActive) {
      startStopBtn.innerHTML = '>'
      clearInterval(timerIntervalId)
      currentTimer = { hours: 0, minutes: 0, seconds: 0 }
      timerOutput.innerHTML = '00:00:00'
      _showTimePeriods()
    } else {
      startStopBtn.innerHTML = '||'

      timerIntervalId = setInterval(_updateTimer, 1000)
    }
  },

  setOccupation(occName) {
    app.setOccupation(occName)
    occupation = app.getTimerStatus().occupation
    occupationBtn.style.backgroundColor = occupation.color
    currentOccupationName.innerHTML = occupation.name
  },

  showOccupationModal() {
    occModal.showModal()

    occModal.addEventListener('click', (Event) => {
      modalHandler(Event, occModal)
    })

    closeModalBtn.addEventListener('click', () => {
      occModal.close()
    })
  },

  addOccupation(name) {
    if (name) app.addOccupation(name)
    occModal.close()
    this.renderDOM()
  },
}

export default DOM
