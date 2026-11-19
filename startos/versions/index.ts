import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_2026_11_16_1_2 } from './v2026.11.16.1_2'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_2026_11_16_1_2],
})
