import './CSS/style.css'
import app from './app/app'
import DOM from './app/modules/DOM'

// CACHE DOM /////////////////////////////////////////////////////////////
const container = document.querySelector('.container')
const nav = container.querySelector('nav')
const main = container.querySelector('main')
const startStopBtn = main.querySelector( '[data-start-stop-btn]' )


// FUNCTIONS ///////////////////////////////////////////////////////////////


// INIT //////////////////////////////////////////////////////////////////
window.app = app

// BIND EVENTS ///////////////////////////////////////////////////////////
startStopBtn.addEventListener('click', ()=>{
  DOM.switchTimer()
})