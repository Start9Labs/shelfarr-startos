import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value, Variants } = sdk

export const connectAudiobookshelf = sdk.Action.withInput(
  'connect-audiobookshelf',
  {
    name: i18n('Configure Audiobookshelf'),
    description: i18n(
      'Connect Audiobookshelf on this server using automatically managed credentials and library IDs. Enable Service Integrations there when prompted. Its external libraries must include the shared output folders. Changes restart Shelfarr.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  InputSpec.of({
    connection: Value.union({
      name: i18n('Audiobookshelf Connection'),
      default: 'disabled',
      variants: Variants.of({
        disabled: { name: i18n('Disabled'), spec: InputSpec.of({}) },
        enabled: {
          name: i18n('Enabled'),
          spec: InputSpec.of({
            audiobookLibraryId: Value.text({
              name: i18n('Audiobook Library ID'),
              description: i18n(
                'Copy the library ID from its Audiobookshelf URL. Leave empty to skip this format.',
              ),
              required: false,
              default: null,
            }),
            comicbookLibraryId: Value.text({
              name: i18n('Comic Library ID'),
              description: i18n(
                'Copy the library ID from its Audiobookshelf URL. Leave empty to use the ebook library for comics.',
              ),
              required: false,
              default: null,
            }),
            ebookLibraryId: Value.text({
              name: i18n('Ebook Library ID'),
              description: i18n(
                'Copy the library ID from its Audiobookshelf URL. Leave empty to skip this format.',
              ),
              required: false,
              default: null,
            }),
          }),
        },
      }),
    }),
  }),
  async () => {
    const connection = await storeJson.read((s) => s.audiobookshelf).once()
    return {
      connection: connection
        ? {
            selection: 'enabled' as const,
            value: {
              audiobookLibraryId: connection.audiobookLibraryId,
              ebookLibraryId: connection.ebookLibraryId,
              comicbookLibraryId: connection.comicbookLibraryId,
            },
          }
        : { selection: 'disabled' as const, value: {} },
    }
  },
  async ({ effects, input: { connection } }) => {
    if (connection.selection === 'disabled') {
      await storeJson.merge(effects, { audiobookshelf: false })
      return
    }
    const audiobookLibraryId =
      connection.value.audiobookLibraryId?.trim() || null
    const ebookLibraryId = connection.value.ebookLibraryId?.trim() || null
    const comicbookLibraryId =
      connection.value.comicbookLibraryId?.trim() || null
    if (!(audiobookLibraryId || ebookLibraryId || comicbookLibraryId))
      throw new Error(i18n('Provide at least one library ID.'))
    await storeJson.merge(effects, {
      audiobookshelf: {
        audiobookLibraryId,
        ebookLibraryId,
        comicbookLibraryId,
      },
    })
  },
)
