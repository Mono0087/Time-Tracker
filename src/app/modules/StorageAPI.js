const localStorageAPI = {
  LOCAL_STORAGE_KEY:'timerData',
  save(data) {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data))
  },
  load() {
    return JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY))
  },
}

const storages = { localStorage: localStorageAPI }

class Storage {
  constructor(storageName) {
    this.storageAPI = storages[storageName]
  }

  save(data, optsObj) {
    this.storageAPI.save(data, optsObj)
  }

  load(optsObj) {
    return this.storageAPI.load(optsObj)
  }
}

export default Storage
