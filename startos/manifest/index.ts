import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'shelfarr',
  title: 'Shelfarr',
  license: 'GPL-3.0',
  packageRepo: 'https://github.com/Start9Labs/shelfarr-startos',
  upstreamRepo: 'https://github.com/Pedro-Revez-Silva/shelfarr',
  marketingUrl: 'https://shelfarr.org/',
  donationUrl: null,
  description: { short, long },
  volumes: ['main', 'startos'],
  images: {
    shelfarr: {
      source: { dockerTag: 'ghcr.io/pedro-revez-silva/shelfarr:2026.11.09.1' },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
