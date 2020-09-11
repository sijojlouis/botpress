import {
  Button,
  ButtonGroup,
  HTMLSelect,
  IconName,
  MaybeElement,
  Popover,
  Position,
  Tooltip as BpTooltip
} from '@blueprintjs/core'
import { lang } from 'botpress/shared'
import cx from 'classnames'
import _ from 'lodash'
import moment from 'moment'
import React, { FC, Fragment, useEffect, useRef, useState } from 'react'

import style from './style.scss'

const TranslationCenter: FC<any> = ({ bp }) => {
  const [flows, setFlows] = useState([])
  const [topics, setTopics] = useState([])
  const [qnas, setQnas] = useState({})

  useEffect(() => {
    bp.axios
      .get(`flows`)
      .then(({ data }) => {
        setFlows(data)
      })
      .catch(() => {})
    bp.axios
      .get(`topics`)
      .then(({ data }) => {
        setTopics(data)
        data?.map(({ name }) => getTopicQnAs(name))
      })
      .catch(() => {})
  }, [])

  const getTopicQnAs = async topicName => {
    const { data } = await bp.axios.get(`/mod/qna/${topicName}/questions?question=`)
    setQnas({ ...qnas, [topicName]: data })
  }

  return (
    <div>
      {flows.map(flow => (
        <Fragment>
          <h1 key={flow.name}>{flow.name}</h1>
          {flow.nodes
            .filter(x => !['success', 'failure', 'entry'].includes(x.type))
            .map((node, i) => {
              console.log(node)
              return (
                <h2 key={`${flow.name}-${i}`}>
                  {node.name} - {node.type}
                </h2>
              )
            })}
        </Fragment>
      ))}
      {topics.map(({ name }, index) => (
        <Fragment>
          <h1 key={index}>{name}</h1>
          {qnas[name]?.items?.map((qna, i) => {
            console.log(qna)
            return <h2 key={`${index}-${i}`}>'test'</h2>
          })}
        </Fragment>
      ))}
    </div>
  )
}

export default TranslationCenter
