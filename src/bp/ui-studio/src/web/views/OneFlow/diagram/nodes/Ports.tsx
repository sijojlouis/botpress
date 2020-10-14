import { Tooltip } from '@blueprintjs/core'
import * as sdk from 'botpress/sdk'
import cx from 'classnames'
import _ from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import { DefaultPortModel } from 'storm-react-diagrams'
import { newNodeTypes } from '~/views/FlowBuilder/diagram/manager'
import style from '~/views/FlowBuilder/diagram/nodes/style.scss'

import { PortWidget } from './PortWidget'

export class StandardIncomingPortModel extends DefaultPortModel {
  constructor(name: string, type: string) {
    super(true, name, type)
  }

  serialize() {
    return _.merge(super.serialize(), {})
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine)
  }
}

export class StandardOutgoingPortModel extends DefaultPortModel {
  constructor(name: string) {
    super(false, name)
  }

  serialize() {
    return _.merge(super.serialize(), {})
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine)
  }
}

type Props = {
  className?: string
  name: string
  node: any
  next?: sdk.NodeTransition[]
  hidden?: boolean
  simplePortClick?: (e: React.MouseEvent) => void
}

export class StandardPortWidgetDisconnected extends React.PureComponent<Props> {
  renderSubflowNode() {
    const index = Number(this.props.name.replace('out', ''))
    const subflow = this.props.node.next[index].node.replace(/\.flow\.json$/i, '')
    const isInvalid = false

    return (
      <div className={cx(style.label, 'label', { [style.invalidFlow]: isInvalid })}>
        {isInvalid ? (
          <Tooltip content="The destination for this transition is invalid">{subflow}</Tooltip>
        ) : (
          <Link to={`/oneflow/${subflow}`}>{subflow}</Link>
        )}
      </div>
    )
  }

  renderEndNode() {
    return <div className={cx(style.label, 'label')}>End of flow</div>
  }

  renderStartNode() {
    return <div className={cx(style.label, 'label')}>Start</div>
  }

  renderReturnNode() {
    const node = this.props.node
    const index = Number(this.props.name.replace('out', ''))
    let returnTo = node.next[index].node.substr(1)

    if (!returnTo.length) {
      returnTo = '@calling'
    }

    return <div className={cx(style.label, 'label')}>Return ({returnTo})</div>
  }

  render() {
    let type = 'normal'
    let missingConnection = false

    if (this.props.name === 'in' && this.props.node.isStartNode) {
      type = 'start'
    } else if (this.props.name !== 'in') {
      const index = Number(this.props.name.replace(/out/i, ''))
      const nextNode = _.get(this.props.node, `next.${index}`)

      if (!nextNode) {
        missingConnection = true
      } else if (nextNode.node && nextNode.node.toLowerCase() === 'end') {
        type = 'end'
      } else if (/\.flow\.json$/i.test(nextNode.node)) {
        type = 'subflow'
      } else if (/^#/i.test(nextNode.node)) {
        type = 'return'
      } else if (nextNode.node === '') {
        missingConnection = true
      }
    }

    const className = cx(this.props.className, style.portContainer, 'portContainer', {
      [style.startPort]: type === 'start',
      [style.subflowPort]: type === 'subflow',
      [style.endPort]: type === 'end',
      [style.returnPort]: type === 'return',
      [style.portLabel]: /end|subflow|start|return/i.test(type),
      [style.missingConnection]: missingConnection,
      [style.hiddenPort]: this.props.hidden
    })

    const isNewNodeType = newNodeTypes.includes(this.props.node.type)

    return (
      <div className={className}>
        <PortWidget {...this.props} />
        {type === 'subflow' && this.renderSubflowNode()}
        {type === 'end' && this.renderEndNode()}
        {!isNewNodeType && type === 'start' && this.renderStartNode()}
        {type === 'return' && this.renderReturnNode()}
      </div>
    )
  }
}

export const StandardPortWidget = StandardPortWidgetDisconnected