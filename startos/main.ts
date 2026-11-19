import { writeFile } from 'node:fs/promises'
import { FileHelper } from '@start9labs/start-sdk'
import { manifest as nzbgetManifest } from 'nzbget-startos/startos/manifest'
import { credentialsShape } from 'nzbget-startos/startos/fileModels/credentials'
import {
  uiHostId as nzbgetHostId,
  uiPort as nzbgetPort,
} from 'nzbget-startos/startos/utils'
import { manifest as filebrowserManifest } from 'filebrowser-quantum-startos/startos/manifest'
import { manifest as nextexplorerManifest } from 'nextexplorer-startos/startos/manifest'
import { manifest as qbittorrentManifest } from 'qbittorrent-startos/startos/manifest'
import {
  downloadLocationFile,
  downloadLocationShape,
} from 'qbittorrent-startos/startos/fileModels/downloadLocation'
import { manifest as prowlarrManifest } from 'prowlarr-startos/startos/manifest'
import { manifest as audiobookshelfManifest } from 'audiobookshelf-startos/startos/manifest'
import {
  publicApiKeyFile as audiobookshelfKeyFile,
  uiPort as audiobookshelfPort,
} from 'audiobookshelf-startos/startos/utils'
import {
  uiHostId as qbittorrentHostId,
  uiPort as qbittorrentPort,
} from 'qbittorrent-startos/startos/utils'
import {
  uiHostId as prowlarrHostId,
  uiPort as prowlarrPort,
} from 'prowlarr-startos/startos/utils'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  bootstrapScript,
  mediaMountpoints,
  prepareMediaScript,
  uiPort,
  validMediaPaths,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Shelfarr!'))
  const store = await storeJson.read().const(effects)
  if (!store?.adminPassword)
    throw new Error(i18n('Set the admin password before signing in'))
  const outputPaths = [
    store.audiobookPath,
    store.ebookPath,
    store.comicbookPath,
  ]
  if (!validMediaPaths(store.mediaSources, outputPaths))
    throw new Error(
      i18n('Output folders must be inside selected storage, not its root.'),
    )

  for (const id of store.mediaSources) {
    if (!(await sdk.getServiceManifest(effects, id, (m) => m !== null).const()))
      throw new Error(
        i18n(
          'Selected storage is not installed. Install it or change Media Storage.',
        ),
      )
  }

  const audiobookshelfAddress = store.audiobookshelfConnected
    ? await sdk.host
        .getBridgeAddress(effects, {
          packageId: 'audiobookshelf',
          hostId: 'ui-multi',
          internalPort: audiobookshelfPort,
          ssl: false,
        })
        .const()
    : null
  const qbittorrentAddress = store.qbittorrentConnected
    ? await sdk.host
        .getBridgeAddress(effects, {
          packageId: 'qbittorrent',
          hostId: qbittorrentHostId,
          internalPort: qbittorrentPort,
          ssl: false,
        })
        .const()
    : null
  const nzbgetAddress = store.nzbgetConnected
    ? await sdk.host
        .getBridgeAddress(effects, {
          packageId: 'nzbget',
          hostId: nzbgetHostId,
          internalPort: nzbgetPort,
          ssl: false,
        })
        .const()
    : null
  const prowlarrAddress = store.prowlarrConnected
    ? await sdk.host
        .getBridgeAddress(effects, {
          packageId: 'prowlarr',
          hostId: prowlarrHostId,
          internalPort: prowlarrPort,
          ssl: false,
        })
        .const()
    : null

  let mounts = sdk.Mounts.of()
    .mountVolume({
      volumeId: 'main',
      subpath: 'storage',
      mountpoint: '/rails/storage',
      readonly: false,
    })
    .mountVolume({
      volumeId: 'main',
      subpath: 'tmp',
      mountpoint: '/rails/tmp',
      readonly: false,
    })
  if (store.mediaSources.includes('filebrowser'))
    mounts = mounts.mountDependency<typeof filebrowserManifest>({
      dependencyId: 'filebrowser',
      volumeId: 'data',
      subpath: null,
      mountpoint: mediaMountpoints.filebrowser,
      readonly: false,
    })
  if (store.mediaSources.includes('nextexplorer'))
    mounts = mounts.mountDependency<typeof nextexplorerManifest>({
      dependencyId: 'nextexplorer',
      volumeId: 'data',
      subpath: null,
      mountpoint: mediaMountpoints.nextexplorer,
      readonly: false,
    })
  if (audiobookshelfAddress)
    mounts = mounts.mountDependency<typeof audiobookshelfManifest>({
      dependencyId: 'audiobookshelf',
      volumeId: 'public',
      subpath: null,
      mountpoint: '/mnt/audiobookshelf',
      readonly: true,
    })
  if (qbittorrentAddress)
    mounts = mounts.mountDependency<typeof qbittorrentManifest>({
      dependencyId: 'qbittorrent',
      volumeId: 'public',
      subpath: null,
      mountpoint: '/mnt/qbittorrent',
      readonly: true,
    })
  if (nzbgetAddress)
    mounts = mounts.mountDependency<typeof nzbgetManifest>({
      dependencyId: 'nzbget',
      volumeId: 'public',
      subpath: null,
      mountpoint: '/mnt/nzbget',
      readonly: true,
    })
  if (prowlarrAddress)
    mounts = mounts.mountDependency<typeof prowlarrManifest>({
      dependencyId: 'prowlarr',
      volumeId: 'public',
      subpath: null,
      mountpoint: '/mnt/prowlarr',
      readonly: true,
    })

  const sub = sdk.SubContainer.of(
    effects,
    { imageId: 'shelfarr' },
    mounts,
    'shelfarr-sub',
  )
  const readKey = async (path: string) =>
    (
      await FileHelper.string(await sub.subpath(path))
        .read()
        .const(effects)
    )?.trim() || null
  const audiobookshelfKey = audiobookshelfAddress
    ? await readKey(`/mnt/audiobookshelf/${audiobookshelfKeyFile}`)
    : null
  const qbittorrentKey = qbittorrentAddress
    ? await readKey('/mnt/qbittorrent/api-key')
    : null
  const qbittorrentDownloadPath = qbittorrentAddress
    ? await FileHelper.json(
        await sub.subpath(`/mnt/qbittorrent/${downloadLocationFile}`),
        downloadLocationShape,
      )
        .read(({ downloadPath }) => downloadPath)
        .const(effects)
    : null
  if (
    qbittorrentAddress &&
    qbittorrentKey &&
    (!qbittorrentDownloadPath ||
      !validMediaPaths(store.mediaSources, [qbittorrentDownloadPath]))
  )
    throw new Error(
      i18n(
        'qBittorrent must download to shared storage selected in Media Storage. Choose FileBrowser Quantum or NextExplorer in qBittorrent’s Set Download Location and include it in Media Storage, or disconnect qBittorrent.',
      ),
    )
  const prowlarrKey = prowlarrAddress
    ? await readKey('/mnt/prowlarr/api-key')
    : null
  const nzbgetCredentials = nzbgetAddress
    ? await FileHelper.json(
        await sub.subpath('/mnt/nzbget/credentials.json'),
        credentialsShape,
      )
        .read(({ username, password, downloadPath }) => ({
          username,
          password,
          downloadPath,
        }))
        .const(effects)
    : null
  if (
    nzbgetCredentials?.downloadPath &&
    !validMediaPaths(store.mediaSources, [nzbgetCredentials.downloadPath])
  )
    throw new Error(
      i18n(
        'NZBGet’s download folder must be inside selected storage. Change Media Storage or disconnect NZBGet.',
      ),
    )
  await writeFile(
    `${await sub.rootfs}/usr/local/share/ca-certificates/startos.crt`,
    await sdk.getRootCa(effects),
  )

  const env = {
    PUID: '1000',
    PGID: '1000',
    TZ: 'Etc/UTC',
    HTTP_PORT: String(uiPort),
    TMPDIR: '/rails/tmp',
    DISABLE_AUTH: 'false',
  }
  return sdk.Daemons.of(effects)
    .addOneshot('trust-ca', {
      subcontainer: sub,
      exec: { command: ['update-ca-certificates'] },
      requires: [],
    })
    .addOneshot('prepare-media', {
      subcontainer: sub,
      exec: {
        command: [
          'bash',
          '-ec',
          prepareMediaScript,
          'prepare-media',
          ...outputPaths,
        ],
      },
      requires: [],
    })
    .addOneshot('bootstrap', {
      subcontainer: sub,
      exec: {
        command: sdk.useEntrypoint([
          'bash',
          '-ec',
          './bin/rails db:prepare && ./bin/rails runner "$STARTOS_BOOTSTRAP"',
        ]),
        env: {
          ...env,
          STARTOS_BOOTSTRAP: bootstrapScript,
          STARTOS_CONFIG: JSON.stringify({
            ...store,
            // A withdrawn export clears Shelfarr's cached credential.
            audiobookshelf: audiobookshelfAddress
              ? audiobookshelfKey
                ? {
                    url: `http://${audiobookshelfAddress}`,
                    apiKey: audiobookshelfKey,
                  }
                : false
              : store.audiobookshelfConnected === false
                ? false
                : null,
            qbittorrent:
              qbittorrentAddress && qbittorrentKey && qbittorrentDownloadPath
                ? {
                    url: `http://${qbittorrentAddress}`,
                    apiKey: qbittorrentKey,
                    downloadPath: qbittorrentDownloadPath,
                  }
                : null,
            nzbget:
              nzbgetAddress && nzbgetCredentials?.downloadPath
                ? {
                    url: `http://${nzbgetAddress}`,
                    ...nzbgetCredentials,
                  }
                : null,
            prowlarr:
              prowlarrAddress && prowlarrKey
                ? { url: `http://${prowlarrAddress}`, apiKey: prowlarrKey }
                : null,
          }),
        },
      },
      requires: ['trust-ca', 'prepare-media'],
    })
    .addDaemon('primary', {
      subcontainer: sub,
      exec: {
        command: sdk.useEntrypoint(),
        runAsInit: true,
        env: { ...env, SOLID_QUEUE_IN_PUMA: '1' },
      },
      ready: {
        display: i18n('Web Interface'),
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://127.0.0.1:${uiPort}/up`,
            {
              successMessage: i18n('The web interface is ready'),
              errorMessage: i18n('The web interface is not ready'),
            },
          ),
      },
      requires: ['bootstrap'],
    })
})
