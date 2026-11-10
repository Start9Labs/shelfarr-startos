import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { adminUsername } from '../utils'

export const setAdminPassword = sdk.Action.withoutInput(
  'set-admin-password',
  async ({ effects }) => ({
    name: (await storeJson.read((s) => s.adminPassword).const(effects))
      ? i18n('Reset Admin Password')
      : i18n('Set Admin Password'),
    description: i18n(
      'Generate a new password for the admin account. Applies on startup.',
    ),
    warning: (await storeJson.read((s) => s.adminPassword).const(effects))
      ? i18n(
          'Replaces the admin password and restarts Shelfarr. Existing admin sessions are revoked.',
        )
      : null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  async ({ effects }) => {
    // Shelfarr requires lowercase, uppercase, and a digit.
    const adminPassword =
      'Aa1' + utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 32 })
    await storeJson.merge(effects, { adminPassword })
    return {
      version: '1',
      title: i18n('Login Credentials'),
      message: i18n(
        'Sign in after Shelfarr finishes starting. Keep any configured two-factor authenticator.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: adminUsername,
            masked: false,
            copyable: true,
            qr: false,
            launchable: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: adminPassword,
            masked: true,
            copyable: true,
            qr: false,
            launchable: false,
          },
        ],
      },
    }
  },
)
