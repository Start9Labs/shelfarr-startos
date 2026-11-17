import { sdk } from '../sdk'
import { setAdminPassword } from './setAdminPassword'
import { mediaStorage } from './mediaStorage'
import { connectProwlarr } from './connectProwlarr'
import { connectQbittorrent } from './connectQbittorrent'
import { connectAudiobookshelf } from './connectAudiobookshelf'

export const actions = sdk.Actions.of()
  .addAction(setAdminPassword)
  .addAction(mediaStorage)
  .addAction(connectProwlarr)
  .addAction(connectQbittorrent)
  .addAction(connectAudiobookshelf)
