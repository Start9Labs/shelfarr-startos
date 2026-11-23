import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const connectAudiobookshelf = sdk.Action.withoutInput(
  'connect-audiobookshelf',
  async ({ effects }) => ({
    name: (await storeJson
      .read((s) => s.audiobookshelfConnected)
      .const(effects))
      ? i18n('Disconnect Audiobookshelf')
      : i18n('Connect Audiobookshelf'),
    description: i18n(
      'Toggle automatic connection to Audiobookshelf on this server. Enable Service Integrations there when prompted. Choose libraries in Shelfarr’s settings. Changing the connection restarts Shelfarr.',
    ),
    warning: i18n('Changing this connection restarts Shelfarr.'),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  async ({ effects }) =>
    storeJson.update(
      effects,
      (s) => s && { ...s, audiobookshelfConnected: !s.audiobookshelfConnected },
    ),
)
