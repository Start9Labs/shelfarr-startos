import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const connectProwlarr = sdk.Action.withoutInput(
  'connect-prowlarr',
  async ({ effects }) => ({
    name: (await storeJson.read((s) => s.prowlarrConnected).const(effects))
      ? i18n('Disconnect Prowlarr')
      : i18n('Connect Prowlarr'),
    description: i18n(
      'Toggle automatic connection to Prowlarr on this server. Shelfarr searches Prowlarr directly. Changing the connection restarts Shelfarr.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  async ({ effects }) =>
    storeJson.update(
      effects,
      (s) => s && { ...s, prowlarrConnected: !s.prowlarrConnected },
    ),
)
