import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.11.9.1:0',
  releaseNotes: {
    en_US:
      'Initial StartOS release with managed admin credentials, shared book storage, and optional Prowlarr and qBittorrent connections. The beta Audible/Libation companion is not bundled. Upstream notes: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.09.1',
    es_ES:
      'Primera versión para StartOS con credenciales de administrador gestionadas, almacenamiento de libros compartido y conexiones opcionales a Prowlarr y qBittorrent. No se incluye el servicio auxiliar beta Audible/Libation. Notas: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.09.1',
    de_DE:
      'Erste StartOS-Version mit verwalteten Administrator-Zugangsdaten, gemeinsamem Bücherspeicher und optionalen Prowlarr- und qBittorrent-Verbindungen. Der Beta-Begleitdienst Audible/Libation ist nicht enthalten. Hinweise: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.09.1',
    pl_PL:
      'Pierwsze wydanie dla StartOS z zarządzanymi danymi administratora, wspólnym magazynem książek i opcjonalnymi połączeniami z Prowlarr i qBittorrent. Nie zawiera dodatkowej usługi beta Audible/Libation. Informacje: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.09.1',
    fr_FR:
      'Première version StartOS avec identifiants administrateur gérés, stockage partagé des livres et connexions facultatives à Prowlarr et qBittorrent. Le compagnon bêta Audible/Libation n’est pas inclus. Notes : https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.09.1',
  },
  migrations: { up: async () => {}, down: IMPOSSIBLE },
})
