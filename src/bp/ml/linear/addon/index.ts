import assert from 'assert'
import _ from 'lodash'
import numeric from 'numeric'

import { Data } from '../typings'

import addon, { Model, NLinear, Parameters } from './typings'

export default class BaseSVM {
  private _clf: NLinear | undefined

  constructor(clf?: NLinear) {
    this._clf = clf
  }

  static restore = (model: Model) => {
    const random_seed = parseInt(process.env.NLU_SEED || '')
    const clf = random_seed ? new addon.NLinear({ random_seed }) : new addon.NLinear()

    clf.set_model(model)
    return new BaseSVM(clf)
  }

  train = (dataset: Data[], params: Parameters): Model => {
    const dims = numeric.dim(dataset)
    assert(dims[0] > 0 && dims[1] === 2 && dims[2] > 0, 'dataset must be a list of [X,y] tuples')

    const random_seed = parseInt(process.env.NLU_SEED || '')
    this._clf = random_seed ? new addon.NLinear({ random_seed }) : new addon.NLinear()

    const X = dataset.map(d => d[0])
    const y = dataset.map(d => d[1])

    const svm = this._clf as NLinear
    svm.train({ ...params, mute: 1 }, X, y)
    return svm.get_model()
  }

  predict = (inputs: number[]): number => {
    assert(!!this._clf, 'train classifier first')
    const dims = numeric.dim(inputs)
    assert((dims[0] || 0) > 0 && (dims[1] || 0) === 0, 'input must be a 1d array')
    return (this._clf as NLinear).predict(inputs)
  }

  predictProbabilities = (inputs: number[]): number[] => {
    assert(!!this._clf, 'train classifier first')
    const dims = numeric.dim(inputs)
    assert((dims[0] || 0) > 0 && (dims[1] || 0) === 0, 'input must be a 1d array')

    const svm = this._clf as NLinear
    return svm.predict_probability(inputs).probabilities
  }

  isTrained = () => {
    return !!this._clf ? this._clf.is_trained() : false
  }
}
