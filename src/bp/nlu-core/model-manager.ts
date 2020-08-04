import * as sdk from 'botpress/sdk'
import _ from 'lodash'

import { TrainInput, TrainOutput } from './training-pipeline'
import { EntityCache } from './typings'

export type Model = Omit<sdk.NLUCore.Model, 'data'> & {
  data: {
    input: TrainInput
    output: TrainOutput
  }
}

export function serializeModel(model: Model): sdk.NLUCore.Model {
  const { hash, languageCode, startedAt, finishedAt, data } = model

  const serialized: sdk.NLUCore.Model = {
    hash,
    languageCode,
    startedAt,
    finishedAt,
    data: {
      input: '',
      output: ''
    }
  }

  for (const entity of model.data.output.list_entities) {
    entity.cache = (<EntityCache>entity.cache)?.dump() ?? []
  }
  const serializableData = _.omit(data, ['output.intents', 'input.trainingSession'])
  serialized.data.input = JSON.stringify(serializableData.input)
  serialized.data.output = JSON.stringify(serializableData.output)

  return serialized
}

export function deserializeModel(serialized: sdk.NLUCore.Model): Model {
  const { hash, languageCode, startedAt, finishedAt, data } = serialized

  const model: Model = {
    hash,
    languageCode,
    startedAt,
    finishedAt,
    data: {
      input: JSON.parse(data.input),
      output: JSON.parse(data.output)
    }
  }
  model.data.output.slots_model = Buffer.from(model.data.output.slots_model)
  return model
}
