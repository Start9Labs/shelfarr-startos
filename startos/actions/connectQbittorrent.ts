import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const connectQbittorrent = sdk.Action.withoutInput(
  'connect-qbittorrent',
  async ({ effects }) => ({
    name: (await storeJson.read((s) => s.qbittorrentConnected).const(effects))
      ? i18n('Disconnect qBittorrent')
      : i18n('Connect qBittorrent'),
    description: i18n(
      'Toggle the managed qBittorrent download client. Downloads must use selected shared storage. Changing the connection restarts Shelfarr.',
    ),
    warning: i18n('Changing this connection restarts Shelfarr.'),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  async ({ effects }) =>
    storeJson.update(
      effects,
      (s) => s && { ...s, qbittorrentConnected: !s.qbittorrentConnected },
    ),
)
