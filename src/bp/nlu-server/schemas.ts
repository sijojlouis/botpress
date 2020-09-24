import Joi from 'joi'

import { DEFAULT_DUCK_SERVER, DEFAULT_LANG_SERVER, DEFAULT_LANG_SOURCES } from './config'

const EnumOccurenceSchema = Joi.object({
  name: Joi.string().required(), // ex: 'Paris', 'Montreal', 'Québec'
  synonyms: Joi.array() // ex: 'La Ville des lumières', 'City of Paris'
    .items(Joi.string())
    .optional()
    .default([])
})

const EnumSchema = Joi.object().keys({
  name: Joi.string().required(), // ex: 'cities'
  values: Joi.array()
    .items(EnumOccurenceSchema)
    .required(),
  fuzzy: Joi.number().default(0.9)
})

// TODO: maybe add some field to tell if information is sensitive (secret)...
const PatternSchema = Joi.object().keys({
  name: Joi.string().required(),
  positive_regexes: Joi.string().required(),
  case_sensitive: Joi.bool().default(true)
})

const VariableSchema = Joi.object().keys({
  name: Joi.string().required(),
  variableType: Joi.string().required()
})

const IntentSchema = Joi.object().keys({
  name: Joi.string().required(),
  variables: Joi.array()
    .items(VariableSchema)
    .optional()
    .default([]),
  examples: Joi.array()
    .items(Joi.string())
    .required()
})

const TopicSchema = Joi.object().keys({
  name: Joi.string().required(),
  intents: Joi.array()
    .items(IntentSchema)
    .required()
})

export const TrainInputSchema = Joi.object().keys({
  language: Joi.string().required(),
  topics: Joi.array()
    .items(TopicSchema)
    .required(),
  enums: Joi.array()
    .items(EnumSchema)
    .optional()
    .default([]),
  patterns: Joi.array()
    .items(PatternSchema)
    .optional()
    .default([]),
  password: Joi.string()
    .optional()
    .default(''),
  seed: Joi.number().optional()
})

const LanguageSourcesSchema = Joi.object().keys({
  endpoint: Joi.string().default(DEFAULT_LANG_SERVER),
  authToken: Joi.string().optional()
})

export const NLUConfigSchema = Joi.object().keys({
  ducklingURL: Joi.string().default(DEFAULT_DUCK_SERVER),
  ducklingEnabled: Joi.bool().default(true),
  languageSources: Joi.array()
    .items(LanguageSourcesSchema)
    .default(DEFAULT_LANG_SOURCES)
})