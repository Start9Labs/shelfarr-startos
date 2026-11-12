import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.looseObject({
  adminPassword: z.string().nullable().catch(null),
  mediaSources: z.array(z.enum(['filebrowser', 'nextexplorer'])).catch([]),
  audiobookPath: z.string().catch('/mnt/filebrowser/Shelfarr/audiobooks'),
  ebookPath: z.string().catch('/mnt/filebrowser/Shelfarr/ebooks'),
  comicbookPath: z.string().catch('/mnt/filebrowser/Shelfarr/comics'),
  downloadPath: z.string().nullable().catch(null),
  audiobookshelf: z
    .union([
      z.literal(false),
      z.looseObject({
        audiobookLibraryId: z.string().nullable(),
        ebookLibraryId: z.string().nullable(),
        comicbookLibraryId: z.string().nullable().catch(null),
      }),
    ])
    .nullable()
    .catch(null),
  qbittorrentConnected: z.boolean().catch(false),
  prowlarrConnected: z.boolean().nullable().catch(null),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.startos, subpath: 'store.json' },
  shape,
)

export type Store = z.infer<typeof shape>
