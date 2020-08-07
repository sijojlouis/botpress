import { Model, Parameters } from './addon/typings'

interface LibConfig {
  kFold: number
  normalize: boolean
  reduce: boolean
  retainedVariance: number
  mu?: number[]
  sigma?: number[]
  u?: number[][]
  probability: boolean
}

export type LinearModel = Omit<Model, 'param'> & {
  param: LinearParameters
}
export type LinearParameters = Parameters & LibConfig
export type LinearConfig = Omit<LinearParameters, 'C'> & {
  C: number[] // for grid search
}

export type Data = [number[], number]

export type Report = (ClassificationReport | RegressionReport) & Partial<ReductionReport>

export interface ReductionReport {
  reduce: boolean
  retainedVariance: number
  retainedDimension: number
  initialDimension: number
}

export interface ClassificationReport {
  accuracy: number
  fscore: any
  recall: any
  precision: any
  class: any
  size: any
}

export interface RegressionReport {
  mse: any
  std: number
  mean: any
  size: any
}

export enum SolverTypes {
  L2R_LR = 0,
  L2R_L2LOSS_SVC_DUAL = 1,
  L2R_L2LOSS_SVC = 2,
  L2R_L1LOSS_SVC_DUAL = 3,
  MCSVM_CS = 4,
  L1R_L2LOSS_SVC = 5,
  L1R_LR = 6,
  L2R_LR_DUAL = 7,
  L2R_L2LOSS_SVR = 11,
  L2R_L2LOSS_SVR_DUAL = 12,
  L2R_L1LOSS_SVR_DUAL = 13,
  ONECLASS_SVM = 21
}
