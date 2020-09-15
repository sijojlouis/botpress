import { Tab, Tabs } from '@blueprintjs/core'
import { HeaderButtonProps, lang, MainContent } from 'botpress/shared'
import _ from 'lodash'
import moment from 'moment'
import React, { FC, Fragment, useEffect, useRef, useState } from 'react'

import style from './style.scss'
import TopicItem from './TopicItem'

const TC_TAB_KEY = `bp::${window['BOT_ID']}::tcTab`

const TranslationCenter: FC<any> = ({ bp, defaultLanguage, languages }) => {
  const [flows, setFlows] = useState([])
  const [topics, setTopics] = useState([])
  const [qnas, setQnas] = useState({})

  useEffect(() => {
    bp.axios
      .get(`flows`)
      .then(({ data }) => {
        setFlows(data)
        return null
      })
      .catch(() => {})
    bp.axios
      .get(`topics`)
      .then(({ data }) => {
        setTopics(data)
        data?.forEach(({ name }) => {
          getTopicQnAs(name)
        })
        return null
      })
      .catch(() => {})
  }, [])

  const getTopicQnAs = topicName => {
    bp.axios
      .get(`/mod/qna/${topicName}/questions?question=`)
      .then(({ data }) => {
        setQnas(qnas => ({ ...qnas, [topicName]: data }))
        return null
      })
      .catch(() => {})
  }

  const tabs = [{ id: 'qna', title: lang.tr('module.qna.fullName') }]

  const buttons: HeaderButtonProps[] = []

  return (
    <MainContent.Wrapper>
      <MainContent.Header className={style.header} tabs={tabs} buttons={buttons} />

      <div className={style.content}>
        <Tabs
          defaultSelectedTabId={window['BP_STORAGE'].get(TC_TAB_KEY) || 'flows'}
          onChange={tab => window['BP_STORAGE'].set(TC_TAB_KEY, `${tab}`)}
        >
          <Tab
            title="Flows"
            id="flows"
            panel={
              <div>
                {flows.map(flow => (
                  <Fragment>
                    <h1 key={flow.name}>{flow.name}</h1>
                    {flow.nodes
                      .filter(x => !['success', 'failure', 'entry'].includes(x.type))
                      .map((node, i) => {
                        return (
                          <h2 key={`${flow.name}-${i}`}>
                            {node.name} - {node.type}
                          </h2>
                        )
                      })}
                  </Fragment>
                ))}
              </div>
            }
          />
          <Tab
            title="Q&As"
            id="qnas"
            panel={
              <div>
                {topics.map(({ name }, index) => (
                  <TopicItem
                    key={`${name}-${index}`}
                    defaultLanguage={defaultLanguage}
                    name={name}
                    qnas={qnas[name]?.items || []}
                  />
                ))}
              </div>
            }
          />
        </Tabs>
      </div>
    </MainContent.Wrapper>
  )
}

export default TranslationCenter
