import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import * as serviceWorker from './serviceWorker'
import { loadSounds, playSound } from './sounds'
import { ChordApp } from './ChordApp'

loadSounds(() => {
  ReactDOM.render(
    <React.StrictMode>
      <ChordApp />
    </React.StrictMode>,
    document.getElementById('root')
  )
})

serviceWorker.register()

// @ts-ignore
window.playSound = playSound
