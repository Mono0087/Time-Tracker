import app from '../app'
import createElement from '../utils/createElement'

import ring from '../../assets/sound/Ring-sound-effect.mp3'
import bell from '../../assets/sound/mixkit-clear-announce-tones-2861.wav'
import digital from '../../assets/sound/mixkit-access-allowed-tone-2869.wav'
import beep from '../../assets/sound/digital-camera-beeping-the-foundation-1-00-02.mp3'

const audioArray = { ring, bell, digital, beep }

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
const settingsModal = document.querySelector('[data-settings-modal')
const closeSettingsBtn = document.querySelector('[data-close-settings-btn]')
const saveSettingsBtn = document.querySelector('[data-save-settings-btn]')

let { occupation } = app.getTimerStatus()
let timerIntervalId
let timerCheckIntervalId
let soundIntervalId
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

const _formatSeconds = (seconds) => {
  const str = new Date(1000 * seconds).toISOString()
  const time = str.substring(str.indexOf('T') + 1, str.indexOf('.'))
  return time
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
    li.innerHTML = `<div time-segment data-time="${
      period.time
    }" data-occupation-id="${period.occupation.id}" data-period-id="${
      period.id
    }" class="bg-main-light rounded flex flex-wrap w-full  items-center p-3 shadow-grey-btn text-font-color relative">
      <div class="mr-12">
        <span data-begin-time>${period.start}</span>-<span data-end-time>${
      period.end
    }</span>
      </div>
      <span data-time-interval>${_formatSeconds(period.time)}</span>
      <div class="flex items-center gap-2 ml-auto">
        <span data-occupation-name>${period.occupation.name}</span>
        <div
          data-occupation
          class="rounded-full size-7 border border-border-color">
        </div>
      </div>
      <button data-delete-segment-btn class="bg-main rounded-full border-2 border-border-color absolute w-[20px] h-[20px] top-[-7px] right-[-7px]">
          <div class="translate-y-[-15%]">-<div>
      </button>
    </div>`
    const occCircle = li.querySelector('[data-occupation]')
    occCircle.style.backgroundColor = period.occupation.color
    const deleteBtn = li.querySelector('[data-delete-segment-btn]')
    deleteBtn.addEventListener('click', () => {
      const segmentEl = deleteBtn.parentElement
      const { occupationId } = segmentEl.dataset
      const { periodId } = segmentEl.dataset
      app.deleteSegment(occupationId, periodId)
      _showTimePeriods()
    })
    timePeriodsContainer.prepend(li)
  })
}

const _stopTimer = () => {
  startStopBtn.innerHTML = '>'
  clearInterval(timerIntervalId)
  clearInterval(timerCheckIntervalId)
  clearInterval(soundIntervalId)
  currentTimer = { hours: 0, minutes: 0, seconds: 0 }
  timerOutput.innerHTML = '00:00:00'
}

// DOM object

const DOM = {
  renderDOM() {
    occupationsUl.innerHTML = ''
    const storage = app.getStorage()
    if (storage.occupations.length === 0) return
    storage.occupations.forEach((occ) => {
      const deleteBtn = createElement('button', ['text-[red]'], null, null, 'X')
      const name = createElement('span', ['underline'], null, null, occ.name)

      const li = createElement(
        'li',
        ['flex', 'gap-2'],
        null,
        [name, deleteBtn],
        null,
        [
          {
            dataKey: 'occupationId',
            dataValue: occ.id,
          },
        ]
      )

      li.querySelector('span').addEventListener('click', (Event) => {
        const occId = Event.target.parentElement.dataset.occupationId
        DOM.setOccupation(occId)
      })
      li.querySelector('button').addEventListener('click', (Event) => {
        const occId = Event.target.parentElement.dataset.occupationId
        app.deleteOccupation(occId)
        this.renderDOM()
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
      _stopTimer()
      _showTimePeriods()
    } else {
      startStopBtn.innerHTML = '||'
      timerIntervalId = setInterval(_updateTimer, 1000)

      const { settings } = app.getStorage()
      const audioName = settings.sound
      const interval = Number(settings.interval) * 60000
      const active = settings.on
      const myAudio = new Audio(audioArray[audioName])
      if (active) {
        soundIntervalId = setInterval(() => {
          myAudio.play()
        }, interval)
      }

      timerCheckIntervalId = setInterval(() => {
        const status = app.getTimerStatus()
        if (!status.isActive) {
          _stopTimer()
        }
      }, 120000)
    }
  },

  setOccupation(occId) {
    app.setOccupation(occId)
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

  showSettingsModal() {
    if (app.getTimerStatus().isActive)
      throw Error('Timer is active! Stop timer before open settings.')
    settingsModal.showModal()

    const { settings } = app.getStorage()
    const soundInput = settingsModal.querySelector('[data-sound-type]')
    const onOff = settingsModal.querySelector('[data-sound-active]')
    const interval = settingsModal.querySelector('[data-sound-interval]')

    ;[...soundInput.children].forEach((opt) => {
      opt.removeAttribute('selected')
      if (opt.value === settings.sound) {
        opt.setAttribute('selected', '')
      }
    })

    onOff.checked = settings.on
    interval.value = Number(settings.interval)

    saveSettingsBtn.addEventListener('click', () => {
      const settingsObj = {
        sound: soundInput.value,
        on: onOff.checked,
        interval: interval.value,
      }
      app.changeSettings(settingsObj)
    })

    settingsModal.addEventListener('click', (Event) => {
      modalHandler(Event, settingsModal)
    })

    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.close()
    })
  },
}

export default DOM
