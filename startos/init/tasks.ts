import { mediaStorage } from '../actions/mediaStorage'
import { setAdminPassword } from '../actions/setAdminPassword'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const tasks = sdk.setupOnInit(async (effects) => {
  const password = await storeJson.read((s) => s.adminPassword).const(effects)
  if (!password)
    await sdk.action.createOwnTask(effects, setAdminPassword, 'critical', {
      reason: i18n('Set the admin password before signing in'),
    })
  const sources = await storeJson.read((s) => s.mediaSources).const(effects)
  if (!sources?.length)
    await sdk.action.createOwnTask(effects, mediaStorage, 'critical', {
      reason: i18n('Choose where Shelfarr stores your books'),
    })
})
