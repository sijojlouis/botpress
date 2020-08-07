const addon = require('./node-linear.node')
export default addon as BindingType

type LinearCtor = new (args?: { random_seed: number }) => NLinear
type HelloWorld = () => string
export type BindingType = {
  NLinear: LinearCtor
  hello: HelloWorld
}

export interface NLinear {
  train(params: Parameters, x: number[][], y: number[]): void
  predict(x: number[]): number
  predict_probability(x: number[]): ProbabilityResult
  set_model(model: Model): void
  get_model(): Model
  free_model(): void
  is_trained(): boolean
}

interface ProbabilityResult {
  prediction: number
  probabilities: number[]
}

export interface Model {
  param: Parameters
  nr_class: number
  nr_feature: number
  w: number[][]
  label: number[]
  bias: number
  rho: number
}

export interface Parameters extends LibParameters {
  mute: number
}

type LibParameters = {
  solver_type: number
  eps: number
  C: number
  nr_weight: number
  weight_label: number[]
  weight: number[]
  p: number
  nu: number
  init_sol: number[]
  regularize_bias: number
}
