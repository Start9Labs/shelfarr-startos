import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const connectNzbget = sdk.Action.withoutInput(
  'connect-nzbget',
  async ({ effects }) => ({
    name: (await storeJson.read((s) => s.nzbgetConnected).const(effects))
      ? i18n('Disconnect NZBGet')
      : i18n('Connect NZBGet'),
    description: i18n(
      'Toggle the managed NZBGet client. Select its file manager in Media Storage. The completed-download folder and restricted login are provided automatically. Changing the connection restarts Shelfarr.',
    ),
    warning: i18n('Changing this connection restarts Shelfarr.'),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  async ({ effects }) =>
    storeJson.update(
      effects,
      (s) => s && { ...s, nzbgetConnected: !s.nzbgetConnected },
    ),
)
