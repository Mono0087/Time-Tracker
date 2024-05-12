import StorageAPI from './modules/StorageAPI'

// Storage
const Storage = new StorageAPI('localStorage')

let sessionStorage = Storage.load()

if (!sessionStorage) {
  const firstSave = {
    occupations: [{ name: 'default', color: '#ff0000' }],
    days: [],
  }
  Storage.save(firstSave)
  sessionStorage = firstSave
}


const currentTimer = { startTime: undefined, occupation: undefined }

const app = {
  startTimer() {},
}

export default app
