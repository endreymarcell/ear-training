import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import StepApp from './StepApp'
import * as serviceWorker from './serviceWorker'
import { loadSounds, playSound } from './sounds'

loadSounds(() => {
  ReactDOM.render(
    <React.StrictMode>
      <StepApp />
    </React.StrictMode>,
    document.getElementById('root')
  )
})

serviceWorker.register()

// @ts-ignore
window.playSound = playSound
