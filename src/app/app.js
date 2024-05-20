/* eslint-disable import/no-extraneous-dependencies */
import { format } from 'date-fns'
import { isToday } from 'date-fns/isToday'
import StorageAPI from './modules/StorageAPI'

// Storage
const Storage = new StorageAPI('localStorage')

let sessionStorage = Storage.load()
let autosaveIntervalId
let startTimeValue = 0

if (!sessionStorage) {
  const firstSave = {
    occupations: [{ name: 'Default', color: '#ff0000' }],
    days: [
      {
        date: format(new Date(), 'HH:mm:ss yyyy/MM/dd'),
        occupations: [{ name: 'Default', time: 0 }],
      },
    ],
    dayActivity: [],
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

// Functions

const _formatSeconds = (seconds) => {
  const str = new Date(1000 * seconds).toISOString()
  const time = str.substring(str.indexOf('T') + 1, str.indexOf('.'))
  return time
}

// Internal methods

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

const _saveDayActivity = () => {
  const timePeriod = {
    start: timerState.startTime
      ? format(timerState.startTime, 'HH:mm:ss')
      : undefined,
    end: timerState.endTime
      ? format(timerState.endTime, 'HH:mm:ss')
      : undefined,
    time: _formatSeconds(timerState.timeInterval),
    occupation: timerState.occupation,
  }
  if (isToday(timerState.startTime)) {
    sessionStorage.dayActivity.push(timePeriod)
  } else {
    sessionStorage.dayActivity = []
  }
  _update()
}

// App object

const app = {
  getStorage() {
    return { ...sessionStorage }
  },

  getTimerStatus() {
    const timerStatus = {
      isActive: timerState.isActive,
      startPoint: timerState.startTime,
      startTime: timerState.startTime
        ? format(timerState.startTime, 'HH:mm:ss')
        : undefined,
      endTime: timerState.endTime
        ? format(timerState.endTime, 'HH:mm:ss')
        : undefined,
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
      _saveDayActivity()
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
      autosaveIntervalId = setInterval(() => {
        if (!isToday(timerState.startTime)) {
          this.switchTimer()
        }
        _autosave()
      }, 120000)
    }
  },
}
export default app
