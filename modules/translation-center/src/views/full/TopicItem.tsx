import { Button, Icon } from '@blueprintjs/core'
import { lang } from 'botpress/shared'
import cx from 'classnames'
import React, { FC, Fragment, useState } from 'react'

import style from './style.scss'
interface Props {
  defaultLanguage: string
  name: string
  qnas: any[]
}

const TopicItem: FC<Props> = ({ qnas, name, defaultLanguage }) => {
  const [expanded, setExpanded] = useState(false)
  const missingTranslation = false
  const { questions, answers } = qnas.reduce(
    (acc, qna) => {
      // console.log(qna.questions, qna.answers)
      return {
        questions: {
          ...Object.keys(qna.questions).reduce(
            (obj, lang) => ({ ...obj, [lang]: [...(acc.questions[lang] || []), ...(qna.questions[lang] || [])] }),
            acc.questions
          )
        },
        answers: {
          ...Object.keys(qna.answers).reduce(
            (obj, lang) => ({ ...obj, [lang]: [...(acc.answers[lang] || []), ...(qna.answers[lang] || [])] }),
            acc.answers
          )
        }
      }
    },
    { questions: {}, answers: {} }
  )
  const totals = {
    questions: questions?.[defaultLanguage]?.length || 0,
    answers: answers?.[defaultLanguage]?.length || 0
  }

  if (!totals.questions && !totals.answers) {
    return null
  }

  return (
    <div className={style.questionWrapper}>
      <div className={style.headerWrapper}>
        <Button minimal small onClick={() => setExpanded(!expanded)} className={style.questionHeader}>
          <div className={style.left}>
            <Icon icon={!expanded ? 'chevron-right' : 'chevron-down'} /> <h1>{name}</h1>
          </div>
          <div className={style.right}>
            {!!missingTranslation && (
              <span className={cx(style.tag, style.warning)}>{lang.tr('needsTranslation')}</span>
            )}
            <span className={style.tag}>
              {totals.questions} {lang.tr('module.qna.form.q')} · {totals.answers} {lang.tr('module.qna.form.a')}
            </span>
          </div>
        </Button>
      </div>
      {expanded && (
        <Fragment>
          <div className={style.collapsibleWrapper}>
            <div>
              <h2>Questions</h2>
              {Object.keys(questions).map(lang => (
                <ul key={`questions-${lang}`}>
                  {questions[lang]?.map(question => (
                    <li key={`questions-${lang}-${question}`}>{question}</li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <div className={style.collapsibleWrapper}>
            <div>
              <h2>Answers</h2>
              {Object.keys(answers).map(lang => (
                <ul key={`answers-${lang}`}>
                  {answers[lang]?.map(answer => (
                    <li key={`questions-${lang}-${answer}`}>{answer}</li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default TopicItem
