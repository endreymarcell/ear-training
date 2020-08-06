import React from 'react'
import { notes, playSound } from './sounds'
import './ChordApp.css'

function playChord(root: string = 'A2', type: 'major' | 'minor' = 'major') {
  const rootIndex = notes.findIndex((note) => note === root)
  const thirdIndex = rootIndex + (type === 'major' ? 4 : 3)
  const fifthIndex = rootIndex + 7
  const octaveIndex = rootIndex + 12

  const rootNote = notes[rootIndex]
  if (!rootNote) {
    throw Error(`Can't find note for index ${rootIndex}`)
  }
  const thirdNote = notes[thirdIndex]
  if (!thirdNote) {
    throw Error(`Can't find note for index ${thirdIndex}`)
  }
  const fifthNote = notes[fifthIndex]
  if (!fifthNote) {
    throw Error(`Can't find note for index ${fifthIndex}`)
  }
  const octaveNote = notes[octaveIndex]
  if (!octaveNote) {
    throw Error(`Can't find note for index ${octaveIndex}`)
  }
  playSound(rootNote)
  playSound(thirdNote)
  playSound(fifthNote)
  playSound(octaveNote)
}

export const ChordApp: React.FC = () => (
  <div className="chord-app">
    <button onClick={() => playChord('C3')}>I (alap)</button>
    <button onClick={() => playChord('F3')}>IV (másodlagos alap)</button>
    <button onClick={() => playChord('G3')}>V (csúcs)</button>
    <button onClick={() => playChord('A3', 'minor')}>vi (párhuzamos)</button>
  </div>
)
