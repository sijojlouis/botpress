import { LinearParameters, Report } from '../typings'

export type GridSearchResult = { params: LinearParameters; report?: Report }

export type GridSearchProgress = {
  done: number
  total: number
}
