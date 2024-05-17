/* eslint-disable import/no-extraneous-dependencies */
import { format } from 'date-fns'
import { isToday } from 'date-fns/isToday'
import StorageAPI from './modules/StorageAPI'

// Functions

// Storage
const Storage = new StorageAPI('localStorage')

let sessionStorage = Storage.load()
let autosaveIntervalId
let startTimeValue = 0

if (!sessionStorage) {
  const firstSave = {
    occupations: [{ name: 'default', color: '#ff0000' }],
    days: [
      {
        date: format(new Date(), 'HH:mm:ss yyyy/MM/dd'),
        occupations: [{ name: 'default', time: 0 }],
      },
    ],
  }
  Storage.save(firstSave)
  sessionStorage = firstSave
}

const timerState = {
  isActive: false,
  startTime: undefined,
  endTime: undefined,
  timeInterval: undefined,
  occupation: sessionStorage.occupations[0],
}

let dayProgress = sessionStorage.days[sessionStorage.days.length - 1]

const _updateDayProgress = () => {
  if (!isToday(dayProgress.date)) {
    const newDayProgress = {
      date: format(new Date(), 'HH:mm:ss yyyy/MM/dd'),
      occupations: [],
    }
    sessionStorage.days.push(newDayProgress)
    dayProgress = newDayProgress
  }
}

// Internal methods
const _update = () => {
  _updateDayProgress()
  Storage.save(sessionStorage)
}
_update()

const _stopTimer = () => {
  timerState.isActive = false
  timerState.endTime = new Date()
  timerState.timeInterval = Math.round(
    (timerState.endTime - timerState.startTime) / 1_000
  )
  clearInterval(autosaveIntervalId)
}

const _save = () => {
  let occupation = dayProgress.occupations.find(
    (occ) => occ.name === timerState.occupation.name
  )

  if (!occupation) {
    dayProgress.occupations.push({
      name: timerState.occupation.name,
      time: 0,
    })
    startTimeValue = 0
    occupation = dayProgress.occupations.find(
      (occ) => occ.name === timerState.occupation.name
    )
  }

  occupation.time = startTimeValue + timerState.timeInterval

  _update()
}

const _autosave = () => {
  timerState.timeInterval = Math.round(
    (new Date() - timerState.startTime) / 1_000
  )

  let occupation = dayProgress.occupations.find(
    (occ) => occ.name === timerState.occupation.name
  )

  if (!occupation) {
    const newOccupation = {
      name: timerState.occupation.name,
      time: 0,
    }
    occupation = newOccupation
    dayProgress.occupations.push(newOccupation)
    startTimeValue = 0
  }

  occupation.time = startTimeValue + timerState.timeInterval
  _update()
}

// App object
const app = {
  getStorage() {
    return { ...sessionStorage }
  },

  getTimerStatus() {
    const timerStatus = {
      startTime: format(timerState.startTime, 'HH:mm:ss'),
      endTime: format(timerState.endTime, 'HH:mm:ss'),
      timeInterval: timerState.timeInterval,
      occupation: timerState.occupation,
    }
    return timerStatus
  },

  // eslint-disable-next-line consistent-return
  setOccupation(name) {
    if (timerState.isActive)
      throw Error(
        'Error: Timer is active! Stop timer before changing occupation.'
      )
    timerState.occupation = sessionStorage.occupations.find(
      (occupation) => occupation.name === name
    )
  },

  addOccupation(name) {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
    sessionStorage.occupations.push({ name, color: randomColor })
    _update()
  },

  switchTimer() {
    if (timerState.isActive) {
      _stopTimer()
      _save()
    } else {
      _update()
      const occupation = dayProgress.occupations.find(
        (occ) => occ.name === timerState.occupation.name
      )
      if (!occupation) {
        dayProgress.occupations.push({
          name: timerState.occupation.name,
          time: 0,
        })
        startTimeValue = 0
      } else {
        startTimeValue = Number(occupation.time)
      }

      timerState.isActive = true
      timerState.startTime = new Date()
      timerState.timeInterval = 0
      autosaveIntervalId = setInterval(_autosave, 120000)
    }
  },
}
export default app
