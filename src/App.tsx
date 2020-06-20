import React, { useState } from 'react'
import './App.css'
import { getPair, notes, playSound } from './sounds'

enum AppMode {
  ROUND_START,
  QUESTION,
  ANSWER_CORRECT,
  ANSWER_INCORRECT,
  ROUND_END,
}

const numQuestionsInRound = 2

type Question = [number, number] | null

type Answer = '+' | '=' | '-'

function playQuestion(question: Question) {
  if (!question) {
    return
  }
  const firstNote = notes[question[0]]
  const secondNote = notes[question[1]]
  playSound(firstNote, firstNote !== secondNote)
  setTimeout(() => playSound(secondNote), 600)
}

function isAnswerCorrect(question: Exclude<Question, null>, answer: Answer): boolean {
  const [firstNote, secondNote] = question
  const isCorrect =
    (firstNote === secondNote && answer === '=') ||
    (firstNote < secondNote && answer === '+') ||
    (firstNote > secondNote && answer === '-')
  return isCorrect
}

export const App: React.FC<{}> = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.ROUND_START)
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [question, setQuestion] = useState<Question>(null)
  const [points, setPoints] = useState<number>(0)

  const feedback =
    mode === AppMode.ANSWER_CORRECT
      ? 'correct!'
      : mode === AppMode.ANSWER_INCORRECT
      ? 'incorrect'
      : mode === AppMode.ROUND_END
      ? `${points} / 12 helyes válasz`
      : null

  const poseQuestion = () => {
    setMode(AppMode.QUESTION)
    setQuestionIndex(questionIndex + 1)
    const question = getPair()
    setQuestion(question)
    playQuestion(question)
  }

  const evaluateAnswer = (answer: Answer) => {
    if (!question) {
      return
    }
    playQuestion(question)
    if (isAnswerCorrect(question, answer)) {
      setMode(AppMode.ANSWER_CORRECT)
      setPoints(points + 1)
    } else {
      setMode(AppMode.ANSWER_INCORRECT)
    }
  }

  const finalizeRound = () => {
    setMode(AppMode.ROUND_END)
  }

  const isRoundRunning = ![AppMode.ROUND_START, AppMode.ROUND_END].includes(mode)
  const canAnswer = mode === AppMode.QUESTION
  const hasAnswered = [AppMode.ANSWER_CORRECT, AppMode.ANSWER_INCORRECT].includes(mode)
  const shouldShowFinalizeButton = hasAnswered && questionIndex === numQuestionsInRound

  return (
    <div className="App">
      {mode === AppMode.ROUND_START && <button onClick={() => poseQuestion()}>Start game</button>}
      {isRoundRunning && (
        <div>
          {questionIndex} / {numQuestionsInRound}
        </div>
      )}
      {isRoundRunning && (
        <div>
          <button onClick={() => playQuestion(question)}>Ismételd</button>
          <button disabled={!canAnswer} onClick={() => evaluateAnswer('+')}>
            Magasabb
          </button>
          <button disabled={!canAnswer} onClick={() => evaluateAnswer('=')}>
            Ugyanaz
          </button>
          <button disabled={!canAnswer} onClick={() => evaluateAnswer('-')}>
            Mélyebb
          </button>
        </div>
      )}
      <div>
        {feedback}
        {isRoundRunning && !shouldShowFinalizeButton && (
          <button disabled={!hasAnswered} onClick={() => poseQuestion()}>
            Következő
          </button>
        )}
        {shouldShowFinalizeButton && <button onClick={() => finalizeRound()}>Vége</button>}
      </div>
    </div>
  )
}

export default App
