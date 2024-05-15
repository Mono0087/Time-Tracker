/* eslint-disable import/no-extraneous-dependencies */
import { format } from 'date-fns'
import { isSameDay } from 'date-fns/isSameDay'
import StorageAPI from './modules/StorageAPI'

// Storage
const Storage = new StorageAPI('localStorage')

let sessionStorage = Storage.load()
let autosaveIntervalId

if (!sessionStorage) {
  const firstSave = {
    occupations: [{ name: 'default', color: '#ff0000' }],
    days: [
      {
        date: format(new Date(), 'HH:mm:ss yyyy/MM/dd'),
        occupations: [{ name: 'default', time: 0 }],
      },
    ], // TODO Set the default progress for the first day
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

const _updateStorage = () => {
  Storage.save(sessionStorage)
}

const _autosave = () => {
  const lastDay = sessionStorage.days[sessionStorage.days.length - 1]
  const isToday = isSameDay(
    new Date(),
    sessionStorage.days[sessionStorage.days.length - 1].date
  )
  timerState.timeInterval = Math.round(
    (new Date() - timerState.startTime) / 1_000
  )

  const occupation = lastDay.occupations.find(
    (occ) => occ.name === timerState.occupation.name
  )
  if (isToday) {
    if (!occupation) {
      lastDay.occupations.push({
        name: timerState.occupation.name,
        time: timerState.timeInterval,
      })
      _updateStorage()
      return
    }

    // Сохранить временной отрезок для текущего занятия на этот день
    occupation.time = Number(occupation.time) + timerState.timeInterval
    _updateStorage()
  } else {
    // Create and save new day object for next day
    sessionStorage.days.push({
      date: format(new Date(), 'HH:mm:ss yyyy/MM/dd'),
      occupations: [
        {
          name: timerState.occupation.name,
          time: 0,
        },
      ],
    })
    _updateStorage()

    console.log('next day!')
  }
  console.log({...sessionStorage})
}

const _stopTimer = () => {
  timerState.isActive = false
  timerState.endTime = new Date()
  timerState.timeInterval = Math.round(
    (timerState.endTime - timerState.startTime) / 1_000
  )
  clearInterval(autosaveIntervalId)
}

const _save = () => {
  const lastDay = sessionStorage.days[sessionStorage.days.length - 1]
  const isToday = isSameDay(
    new Date(),
    sessionStorage.days[sessionStorage.days.length - 1].date
  )

  const occupation = lastDay.occupations.find(
    (occ) => occ.name === timerState.occupation.name
  )
  if (isToday) {
    // Если во внешнем хранилище на сегодняшний день нет заданного типа занятия, указанного в timerState, то сохранить тип занятия во внешнее хранилище на последний день
    if (!occupation) {
      lastDay.occupations.push({
        name: timerState.occupation.name,
        time: timerState.timeInterval,
      })
      _updateStorage()
      return
    }

    // Сохранить временной отрезок для текущего занятия на этот день
    occupation.time = Number(occupation.time) + timerState.timeInterval
    _updateStorage()
  } else {
    // Create and save new day object for next day
    sessionStorage.days.push({
      date: format(new Date(), 'HH:mm:ss yyyy/MM/dd'),
      occupations: [
        {
          name: timerState.occupation.name,
          time: timerState.timeInterval,
        },
      ],
    })
    _updateStorage()

    console.log('next day!')
  }
}

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
    _updateStorage()
  },

  switchTimer() {
    if (timerState.isActive) {
      _stopTimer()
      _save()
    } else {
      // Start timer
      timerState.isActive = true
      timerState.startTime = new Date()
      // TODO Запускать оповещения если включены
      /* TODO 
        -Обновлять каждые 2 минуты объект сегодняшнего дня в sessionStorage, 
        -прибавлять прогресс в секундах и сохранять. 
        -Если день сменился, то сохранять новый объект дня */
      autosaveIntervalId = setInterval(_autosave, 2000)
    }
  },
}
export default app
