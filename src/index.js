import './CSS/style.css'
import app from './app/app'
import DOM from './app/modules/DOM'

let activeDialog

// CACHE DOM /////////////////////////////////////////////////////////////
const container = document.querySelector('.container')
const main = container.querySelector('main')
const startStopBtn = main.querySelector('[data-start-stop-btn]')
const occupationDialogBtn = main.querySelector('[data-controls-occupation]')
const occupationDialog = main.querySelector('[data-occ-dialog]')
const addOccupationBtn = main.querySelector('[data-add-occupation-btn]')
const saveOccupationBtn = main.querySelector('[data-save-occupation-btn]')
const settingsBtn = container.querySelector('[data-settings-btn]')

// FUNCTIONS ///////////////////////////////////////////////////////////////

const dialogClickHandler = (Event) => {
  if (activeDialog) {
    const dialogDimensions = activeDialog.getBoundingClientRect()
    if (
      Event.clientX < dialogDimensions.left ||
      Event.clientX > dialogDimensions.right ||
      Event.clientY < dialogDimensions.top ||
      Event.clientY > dialogDimensions.bottom
    ) {
      activeDialog.close()
      activeDialog = undefined
    }
  }
}

// INIT //////////////////////////////////////////////////////////////////

window.app = app
DOM.renderDOM()

// BIND EVENTS ///////////////////////////////////////////////////////////
startStopBtn.addEventListener('click', () => {
  DOM.switchTimer()
})

occupationDialogBtn.addEventListener('click', () => {
  if (occupationDialog.hasAttribute('open')) {
    occupationDialog.close()
    activeDialog = undefined
    return
  }
  setTimeout(() => {
    occupationDialog.show()
    activeDialog = occupationDialog
    window.addEventListener('click', dialogClickHandler)
  }, 0)
})

addOccupationBtn.addEventListener('click', () => {
  DOM.showOccupationModal()
})

saveOccupationBtn.addEventListener('click', () => {
  const occupation = main.querySelector('[data-new-occupation]').value
  DOM.addOccupation(occupation)
})

window.addEventListener('keydown', (Event) => {
  if (Event.code === 'Space') {
    DOM.switchTimer()
  }
})

settingsBtn.addEventListener('click', DOM.showSettingsModal)
