import { Button, Icon } from '@blueprintjs/core'
import { lang, ToolTip } from 'botpress/shared'
import cx from 'classnames'
import React, { FC, Fragment, useState } from 'react'

import style from './style.scss'
interface Props {
  languages: string[]
  defaultLanguage: string
  name: string
  qnas: any[]
  powerMode: boolean
}

const TopicItem: FC<Props> = ({ qnas, name, defaultLanguage, languages, powerMode }) => {
  const [expanded, setExpanded] = useState(true)
  const [expandedLangs, setExpandedLangs] = useState({
    ...languages.reduce((acc, lang) => ({ ...acc, [lang]: true }), {})
  })
  const missingTranslation = false
  const { questions, answers } = qnas.reduce(
    (acc, qna) => ({
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
    }),
    { questions: {}, answers: {} }
  )
  const totals = {
    questions: questions?.[defaultLanguage]?.length || 0,
    answers: answers?.[defaultLanguage]?.length || 0
  }

  if (!totals.questions && !totals.answers) {
    return null
  }

  const toggleLang = lang => {
    setExpandedLangs({ ...expandedLangs, [lang]: !expandedLangs[lang] })
  }

  languages = languages.filter(lang => lang !== defaultLanguage)

  if (powerMode) {
    return (
      <Fragment>
        <div className={cx(style.lineWrapper, style.collapsibleWrapper)}>
          <span className={cx(style.growItem, style.label)}>{lang.tr(`isoLangs.${defaultLanguage}.name`)}</span>
          {languages.map(language => (
            <Button
              minimal
              icon={expandedLangs[language] ? 'caret-right' : 'caret-left'}
              className={cx(style.growItem, style.label, { [style.collapsed]: !expandedLangs[language] })}
              key={language}
              onClick={() => toggleLang(language)}
            >
              {expandedLangs[language] ? (
                lang.tr(`isoLangs.${language}.name`)
              ) : (
                <ToolTip content={lang.tr(`isoLangs.${language}.name`)}>
                  <span>{language}</span>
                </ToolTip>
              )}
            </Button>
          ))}
        </div>
        <div className={style.collapsibleWrapper}>
          <div>
            <div key={`questions-${lang}`}>
              {questions[defaultLanguage]?.map((question, index) => (
                <div className={style.lineWrapper} key={`questions-${lang}-${question}`}>
                  <span className={style.growItem}>
                    <input value={question} />
                  </span>
                  {languages.map(language => (
                    <span className={cx(style.growItem, { [style.collapsed]: !expandedLangs[language] })}>
                      <input key={`questions-${lang}-${question}`} value={questions[language]?.[index] || ''} />
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div key={`answers-${lang}`}>
              {answers[defaultLanguage]?.map((answer, index) => (
                <div className={style.lineWrapper} key={`answers-${lang}-${answer}`}>
                  <span className={style.growItem}>
                    <input value={answer} />
                  </span>
                  {languages.map(language => (
                    <span className={style.growItem}>
                      <input key={`answers-${lang}-${answer}`} value={answers[language]?.[index] || ''} />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Fragment>
    )
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
        <div>
          <div className={cx(style.lineWrapper, style.collapsibleWrapper)}>
            <span className={cx(style.growItem, style.label)}>{lang.tr(`isoLangs.${defaultLanguage}.name`)}</span>
            {languages.map(language => (
              <Button
                minimal
                icon={expandedLangs[language] ? 'caret-right' : 'caret-left'}
                className={cx(style.growItem, style.label, { [style.collapsed]: !expandedLangs[language] })}
                key={language}
                onClick={() => toggleLang(language)}
              >
                {expandedLangs[language] ? (
                  lang.tr(`isoLangs.${language}.name`)
                ) : (
                  <ToolTip content={lang.tr(`isoLangs.${language}.name`)}>
                    <span>{language}</span>
                  </ToolTip>
                )}
              </Button>
            ))}
          </div>
          <div className={style.collapsibleWrapper}>
            <div>
              <h2>Questions</h2>
              <div key={`questions-${lang}`}>
                {questions[defaultLanguage]?.map((question, index) => (
                  <div className={style.lineWrapper} key={`questions-${lang}-${question}`}>
                    <span className={style.growItem}>
                      <input value={question} />
                    </span>
                    {languages.map(language => (
                      <span className={cx(style.growItem, { [style.collapsed]: !expandedLangs[language] })}>
                        <input key={`questions-${lang}-${question}`} value={questions[language]?.[index] || ''} />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={style.collapsibleWrapper}>
            <div>
              <h2>Answers</h2>
              <div key={`answers-${lang}`}>
                {answers[defaultLanguage]?.map((answer, index) => (
                  <div className={style.lineWrapper} key={`answers-${lang}-${answer}`}>
                    <span className={style.growItem}>
                      <input value={answer} />
                    </span>
                    {languages.map(language => (
                      <span className={style.growItem}>
                        <input key={`answers-${lang}-${answer}`} value={answers[language]?.[index] || ''} />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TopicItem
