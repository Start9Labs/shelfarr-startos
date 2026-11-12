import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { getDownloadPath, validMediaPaths } from '../utils'

const { InputSpec, Value } = sdk

export const mediaStorage = sdk.Action.withInput(
  'media-storage',
  async () => ({
    name: i18n('Media Storage'),
    description: i18n(
      'Choose shared storage and output folders. Changing storage restarts Shelfarr but does not move files.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  InputSpec.of({
    mediaSources: Value.multiselect({
      name: i18n('Storage'),
      description: i18n(
        'FileBrowser Quantum: /mnt/filebrowser. NextExplorer: /mnt/nextexplorer, with one folder per location.',
      ),
      values: {
        filebrowser: 'FileBrowser Quantum',
        nextexplorer: 'NextExplorer',
      },
      default: [],
      minLength: 1,
    }),
    downloadPath: Value.text({
      name: i18n('Download Folder'),
      description: i18n(
        'Shared import folder for the managed qBittorrent client. A setup task requires this as qBittorrent’s default download location, including for other clients using its default.',
      ),
      required: true,
      default: '/mnt/filebrowser/Shelfarr/downloads',
    }),
    audiobookPath: Value.text({
      name: i18n('Audiobook Folder'),
      required: true,
      default: '/mnt/filebrowser/Shelfarr/audiobooks',
    }),
    ebookPath: Value.text({
      name: i18n('Ebook Folder'),
      required: true,
      default: '/mnt/filebrowser/Shelfarr/ebooks',
    }),
    comicbookPath: Value.text({
      name: i18n('Comic Folder'),
      required: true,
      default: '/mnt/filebrowser/Shelfarr/comics',
    }),
  }),
  async () => {
    const store = await storeJson.read().once()
    return (
      store && {
        mediaSources: store.mediaSources,
        downloadPath: getDownloadPath(store),
        audiobookPath: store.audiobookPath,
        ebookPath: store.ebookPath,
        comicbookPath: store.comicbookPath,
      }
    )
  },
  async ({ effects, input }) => {
    if (
      !validMediaPaths(input.mediaSources, [
        input.downloadPath,
        input.audiobookPath,
        input.ebookPath,
        input.comicbookPath,
      ])
    )
      throw new Error(
        i18n('Output folders must be inside selected storage, not its root.'),
      )
    await storeJson.merge(effects, input)
  },
)
