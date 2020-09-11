import 'bluebird-global'
import * as sdk from 'botpress/sdk'
import _ from 'lodash'

import en from '../translations/en.json'
import fr from '../translations/fr.json'

const entryPoint: sdk.ModuleEntryPoint = {
  translations: { en, fr },
  definition: {
    name: 'translation-center',
    fullName: 'Translation Center',
    homepage: 'https://botpress.com',
    menuIcon: 'translate',
    menuText: 'Translation Center'
  }
}

export default entryPoint
