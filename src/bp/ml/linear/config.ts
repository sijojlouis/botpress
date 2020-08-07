import assert from 'assert'
import _ from 'lodash'

import { LinearConfig, LinearParameters, SolverTypes } from './typings'

export function checkConfig(config: LinearConfig) {
  assert(config.kFold > 0, 'k-fold must be >= 1')

  if (config.probability) {
    config.solver_type = SolverTypes.L2R_LR_DUAL
  } else {
    config.solver_type = SolverTypes.L2R_L2LOSS_SVC_DUAL
  }

  return config
}

const defaultConf: LinearConfig = {
  solver_type: SolverTypes.L2R_L2LOSS_SVC_DUAL,
  eps: 1e-3,
  C: [0.1, 1, 2, 5, 10, 20, 100],
  nr_weight: 0,
  weight_label: [],
  weight: [],
  p: 0.1,
  nu: 0.5,
  init_sol: [],
  regularize_bias: 1, // true
  mute: 0,
  probability: true,
  kFold: 4,
  normalize: true,
  reduce: false,
  retainedVariance: 0.99
}

export function configMapper(config: LinearConfig): LinearParameters {
  const { C } = config
  return {
    ...config,
    C: C[0]
  }
}

export function parametersMapper(params: LinearParameters): LinearConfig {
  const { C } = params
  return {
    ...params,
    C: [C]
  }
}

const isNullOrUndefined = (x: any) => _.isNull(x) || _.isUndefined(x)
export function defaultConfig(config: Partial<LinearConfig>): LinearConfig {
  config = _.omitBy(config, isNullOrUndefined)
  return { ...defaultConf, ...config }
}

export function defaultParameters(params: Partial<LinearParameters>): LinearParameters {
  params = _.omitBy(params, isNullOrUndefined)
  const defaultParams = configMapper(defaultConf)
  return { ...defaultParams, ...params }
}
