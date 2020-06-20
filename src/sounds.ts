declare global {
  interface Window {
    sounds: { [name: string]: HTMLAudioElement }
  }
}

window.sounds = {}

export const notes = [
  'A2',
  'Bb2',
  'B2',
  'C3',
  'Db3',
  'D3',
  'Eb3',
  'E3',
  'F3',
  'Gb3',
  'G3',
  'Ab3',
  'A3',
  'Bb3',
  'B3',
  'C4',
  'Db4',
  'D4',
  'Eb4',
  'E4',
  'F4',
  'Gb4',
  'G4',
  'Ab4',
  'A4',
  'Bb4',
  'B4',
  'C5',
]

const FADEOUT_DELAY = 500
const FADEOUT_INTERVAL = 10
const FADEOUT_STEP_NUM = 10

export function loadSounds(onLoaded: () => void) {
  const loadingPromises = []
  for (const note of notes) {
    loadingPromises.push(
      new Promise((resolve, reject) => {
        const audio = new Audio(`/samples/${note}.ogg`)
        audio.addEventListener('canplaythrough', () => {
          resolve()
        })
        window.sounds[note] = audio
      })
    )
  }
  Promise.all(loadingPromises).then(() => onLoaded())
}

export function playSound(soundName: string, shouldFadeOut: boolean = true) {
  const sound = window.sounds[soundName]
  sound.volume = 1
  sound.currentTime = 0
  sound.play()
  if (shouldFadeOut) {
    setTimeout(() => fadeOut(sound), FADEOUT_DELAY)
  }
}

function fadeOut(sound: HTMLAudioElement) {
  const limit = FADEOUT_STEP_NUM
  let counter = 0
  const fadeInterval = setInterval(() => {
    if (counter < limit) {
      sound.volume = Math.max(0, sound.volume - 1 / limit)
      counter++
    } else {
      sound.pause()
      sound.currentTime = 0
      clearInterval(fadeInterval)
    }
  }, FADEOUT_INTERVAL)
}

const MAX_DISTANCE_SEMITONES = 5

function randIntBetween(min: number, max: number) {
  const distance = max - min
  return min + Math.round(Math.random() * distance)
}

export function getPair(shouldBeBiased = false): [number, number] {
  const numNotes = notes.length
  const firstNoteIndex = randIntBetween(MAX_DISTANCE_SEMITONES, numNotes - MAX_DISTANCE_SEMITONES)

  if (shouldBeBiased && randIntBetween(1, 5) < 4) {
    return [firstNoteIndex, firstNoteIndex]
  }

  const intervalSemitones = randIntBetween(-MAX_DISTANCE_SEMITONES, MAX_DISTANCE_SEMITONES)
  const secondNoteIndex = firstNoteIndex + intervalSemitones
  return [firstNoteIndex, secondNoteIndex]
}
