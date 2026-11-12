import { posix } from 'node:path'
import { setDownloadLocation } from 'qbittorrent-startos/startos/actions/setDownloadLocation'
import { getDownloadPath, mediaMountpoints } from './utils'
import { i18n } from './i18n'
import { storeJson, Store } from './fileModels/store.json'
import { dependencyDescriptions } from './manifest/i18n'
import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'

type Enabled = (options: { effects: T.Effects }) => Promise<boolean>
const selected =
  (id: Store['mediaSources'][number]): Enabled =>
  async ({ effects }) =>
    (await storeJson.read((s) => s.mediaSources.includes(id)).const(effects)) ??
    false

export const dependencies = sdk.Dependencies.of()
  .addDependency(
    sdk.Dependency.optional('audiobookshelf', {
      description: dependencyDescriptions.audiobookshelf,
      metadata: {
        title: 'Audiobookshelf',
        icon: 'https://raw.githubusercontent.com/Start9Labs/audiobookshelf-startos/8edf4693584e513a1054966afebf594aaa2d3939/icon.svg',
      },
      versionRange: '>=2.37.2:3',
      kind: 'running',
      healthChecks: ['primary'],
      enabled: async ({ effects }) =>
        !!(await storeJson.read((s) => s.audiobookshelf).const(effects)),
    }),
  )
  .addDependency(
    sdk.Dependency.optional('filebrowser', {
      description: dependencyDescriptions.filebrowser,
      metadata: {
        title: 'FileBrowser Quantum',
        icon: 'https://raw.githubusercontent.com/Start9Labs/filebrowser-quantum-startos/907892ceb4c8144fc15fd12f3cfe05811881cd4b/icon.svg',
      },
      versionRange: '>=#quantum:2.0.2-stable:3',
      kind: 'exists',
      enabled: selected('filebrowser'),
    }),
  )
  .addDependency(
    sdk.Dependency.optional('nextexplorer', {
      description: dependencyDescriptions.nextexplorer,
      metadata: {
        title: 'NextExplorer',
        icon: 'https://raw.githubusercontent.com/Start9Labs/nextexplorer-startos/573adc5ec7c741df8ea8d857f574e9fe3e6431c9/icon.svg',
      },
      versionRange: '>=2.2.7:0',
      kind: 'exists',
      enabled: selected('nextexplorer'),
    }),
  )
  .addDependency(
    sdk.Dependency.optional('qbittorrent', {
      description: dependencyDescriptions.qbittorrent,
      metadata: {
        title: 'qBittorrent',
        icon: 'https://raw.githubusercontent.com/Start9Labs/qbittorrent-startos/a1d5e8fde103a8014f9c3bf0055f999bdff01f92/icon.svg',
      },
      versionRange: '>=5.3.0:5',
      kind: 'running',
      healthChecks: ['primary'],
      enabled: async ({ effects }) =>
        (await storeJson.read((s) => s.qbittorrentConnected).const(effects)) ??
        false,
    }).withInit(async (effects) => {
      const store = await storeJson.read().const(effects)
      await sdk.action.clearTask(effects, 'qbittorrent:set-download-location')
      if (!store) return
      const path = posix.normalize(getDownloadPath(store))
      const source = store.mediaSources.find((id) =>
        path.startsWith(`${mediaMountpoints[id]}/`),
      )
      if (!source) return
      const location = {
        selection: source,
        value: { subfolder: posix.relative(mediaMountpoints[source], path) },
      }
      await sdk.action.createTask(
        effects,
        'qbittorrent',
        setDownloadLocation,
        'critical',
        {
          input: {
            kind: 'partial',
            accept: [{ location }],
            set: { location },
          },
          when: { condition: 'input-not-matches', once: false },
          reason: i18n(
            'Set qBittorrent’s default download location to Shelfarr’s download folder. This also affects other clients using qBittorrent’s default.',
          ),
        },
      )
    }),
  )
  .addDependency(
    sdk.Dependency.optional('prowlarr', {
      description: dependencyDescriptions.prowlarr,
      metadata: {
        title: 'Prowlarr',
        icon: 'https://raw.githubusercontent.com/Start9Labs/prowlarr-startos/fe368cd1843c6b7e2b47ef0829341a9d9d45a596/icon.svg',
      },
      versionRange: '>=2.7.0.5723:4',
      kind: 'running',
      healthChecks: ['primary'],
      enabled: async ({ effects }) =>
        (await storeJson.read((s) => s.prowlarrConnected).const(effects)) ??
        false,
    }),
  )
