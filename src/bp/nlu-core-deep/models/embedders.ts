const ort = require('onnxruntime')
import axios from 'axios'
import crypto from 'crypto'
import fs from 'fs'
import fse from 'fs-extra'
import { has } from 'lodash'
import lru from 'lru-cache'
import { mean, reshape } from 'mathjs'
import path from 'path'
import { BertWordPieceTokenizer, BPETokenizer, ByteLevelBPETokenizer, SentencePieceBPETokenizer } from 'tokenizers'

export const regex_sentence: RegExp = /(?<=\s+|^)[\"\'\'\"\'\"\[\(\{\⟨](.*?[.?!])(\s[.?!])*[\"\'\'\"\'\"\]\)\}\⟩](?=\s+|$)|(?<=\s+|^)\S(.*?[.?!])(\s[.?!])*(?=\s+|$)/g

const hash_str = str =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex')

export default class Embedder {
  private _embedder: typeof ort.InferenceSession
  private _tokenizer!: BertWordPieceTokenizer | BPETokenizer | ByteLevelBPETokenizer
  private _cache!: lru<string, Float32Array>
  private _modelPath!: string
  public embedSize!: number

  constructor(public lang: string) {
    this._modelPath = path.join(process.APP_DATA_PATH, lang)
  }

  async _getEmbedSize(): Promise<number> {
    const sentence = 'Dummy sentence to get embed size'
    const tokens = await this._tokenizer.encode(sentence)
    const id_array = BigInt64Array.from(tokens.ids, x => BigInt(x))
    const attention_array = BigInt64Array.from(tokens.attentionMask, x => BigInt(x))
    const ids = new ort.Tensor('int64', id_array, [1, tokens.length])
    const attention = new ort.Tensor('int64', attention_array, [1, tokens.length])

    const results = await this._embedder.run({
      input_ids: ids,
      attention_mask: attention
    })

    const embedding = reshape(Array.from(results.output_0.data), results.output_0.dims)
    return embedding[0][0].length
  }

  async load() {
    if (fs.existsSync(path.join(this._modelPath, 'vocab.txt'))) {
      this._tokenizer = await BertWordPieceTokenizer.fromOptions({
        vocabFile: path.join(this._modelPath, 'vocab.txt')
      })
    } else if (fs.existsSync(path.join(this._modelPath, 'vocab.json'))) {
      this._tokenizer = await BPETokenizer.fromOptions({
        vocabFile: path.join(this._modelPath, 'vocab.json'),
        mergesFile: path.join(this._modelPath, 'merges.txt')
      })
    } else {
      throw new Error('Cannot load tokenizer, check the files path')
    }

    try {
      if (fs.existsSync(path.join(path.join(this._modelPath, 'embedder.onnx')))) {
        this._embedder = await ort.InferenceSession.create(path.join(this._modelPath, 'embedder.onnx'))
        this.embedSize = await this._getEmbedSize()
      } else {
        throw new Error('bad file format')
      }
    } catch (e) {
      console.log(e)
      throw e
    }

    this._cache = new lru<string, Float32Array>({
      length: (arr: Float32Array) => {
        if (arr && arr.BYTES_PER_ELEMENT) {
          return arr.length * arr.BYTES_PER_ELEMENT
        } else {
          return this.embedSize /* dim */ * Float32Array.BYTES_PER_ELEMENT
        }
      },
      max: this.embedSize /* dim */ * Float32Array.BYTES_PER_ELEMENT /* bytes */ * 10000000 /* 10M sentences */
    })

    if (await fse.pathExists(path.join(this._modelPath, 'embed_cache.json'))) {
      const dump = await fse.readJSON(path.join(this._modelPath, 'embed_cache.json'))
      if (dump) {
        const kve = dump.map(x => ({
          e: x.e,
          k: x.k,
          v: Float32Array.from(Object.values(x.v))
        }))
        this._cache.load(kve)
      }
    }
  }

  async save() {
    await fse.ensureFile(path.join(this._modelPath, 'embed_cache.json'))
    await fse.writeJSON(path.join(this._modelPath, 'embed_cache.json'), this._cache.dump())
  }

  async embed(sentence: string): Promise<number[]> {
    const cache_key = hash_str(sentence)

    if (this._cache.has(cache_key)) {
      return Array.from(this._cache.get(cache_key)!.values())
    } else {
      const sentence_embeddings: number[] = []

      for (const s of sentence.match(regex_sentence) || [sentence]) {
        const tokens = await this._tokenizer.encode(s)
        const id_array = BigInt64Array.from(tokens.ids, x => BigInt(x))
        const attention_array = BigInt64Array.from(tokens.attentionMask, x => BigInt(x))
        const ids = new ort.Tensor('int64', id_array, [1, tokens.length])
        const attention = new ort.Tensor('int64', attention_array, [1, tokens.length])

        const results = await this._embedder.run({
          input_ids: ids,
          attention_mask: attention
        })

        const embedding = reshape(Array.from(results.output_0.data), results.output_0.dims)

        const mean_embed = mean(embedding[0], 0)
        sentence_embeddings.push(mean_embed)
      }

      const sentence_embed = mean(sentence_embeddings, 0)

      this._cache.set(cache_key, sentence_embed)
      return sentence_embed
    }
  }
}