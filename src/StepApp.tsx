import React, { useRef, useState } from 'react'
import './StepApp.css'
import { getPair, notes, playSound } from './sounds'

enum AppMode {
  ROUND_START,
  QUESTION,
  ANSWER_CORRECT,
  ANSWER_INCORRECT,
  ROUND_END,
}

const numQuestionsInRound = 12

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

export const StepApp: React.FC<{}> = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.ROUND_START)
  const questionIndex = useRef<number>(0)
  const [question, setQuestion] = useState<Question>(null)
  const [points, setPoints] = useState<number>(0)

  const poseQuestion = () => {
    setMode(AppMode.QUESTION)
    questionIndex.current++
    const question = getPair(true)
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

  const startRound = () => {
    questionIndex.current = 0
  }

  const finalizeRound = () => {
    setMode(AppMode.ROUND_END)
  }

  const isRoundRunning = ![AppMode.ROUND_START, AppMode.ROUND_END].includes(mode)
  const canAnswer = mode === AppMode.QUESTION
  const hasAnswered = [AppMode.ANSWER_CORRECT, AppMode.ANSWER_INCORRECT].includes(mode)
  const shouldShowFinalizeButton = hasAnswered && questionIndex.current === numQuestionsInRound

  return (
    <div className="app">
      <div className="start-button-container">
        {!isRoundRunning && (
          <button
            onClick={() => {
              startRound()
              poseQuestion()
            }}
          >
            Új játék
          </button>
        )}
      </div>

      <div></div>
      <div>
        {isRoundRunning && (
          <div className="answers">
            <div className="question-repeat">
              <button onClick={() => playQuestion(question)}>Ismételd</button>
            </div>
            <div className="answer-higher">
              <button disabled={!canAnswer} className={canAnswer ? '' : 'disabled'} onClick={() => evaluateAnswer('+')}>
                ⬆ Magasabb
              </button>
            </div>
            <div className="answer-same">
              <button disabled={!canAnswer} className={canAnswer ? '' : 'disabled'} onClick={() => evaluateAnswer('=')}>
                = Ugyanaz
              </button>
            </div>
            <div className="answer-lower">
              <button disabled={!canAnswer} className={canAnswer ? '' : 'disabled'} onClick={() => evaluateAnswer('-')}>
                ⬇ Mélyebb
              </button>
            </div>
          </div>
        )}
        {mode === AppMode.ROUND_END && (
          <div className="points-container">
            Pontszámod:
            <br />
            {points} / {numQuestionsInRound}
          </div>
        )}
      </div>
      <div className="right-block">
        <div className="answer-feedback">
          {mode === AppMode.ANSWER_CORRECT && '✅'}
          {mode === AppMode.ANSWER_INCORRECT && '❌'}
        </div>
        <div>
          {isRoundRunning && !shouldShowFinalizeButton && (
            <button disabled={!hasAnswered} className={hasAnswered ? '' : 'disabled'} onClick={() => poseQuestion()}>
              Következő
            </button>
          )}
          {shouldShowFinalizeButton && <button onClick={() => finalizeRound()}>Vége</button>}
        </div>
      </div>

      {isRoundRunning && (
        <div className="bottom-row">
          {questionIndex.current} / {numQuestionsInRound}
        </div>
      )}
    </div>
  )
}

export default StepApp
