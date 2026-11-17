import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.11.16.1:2',
  releaseNotes: {
    en_US:
      'Added Connect NZBGet with automatically shared restricted credentials and its completed-download import folder. Select NZBGet’s file manager in Media Storage; a mismatched folder blocks startup until corrected or NZBGet is disconnected. qBittorrent and manually named clients remain independent. Upstream notes: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
    es_ES:
      'Se añadió Conectar NZBGet con credenciales restringidas compartidas automáticamente y su carpeta de importación de descargas completadas. Selecciona su gestor de archivos en Almacenamiento multimedia; una carpeta incompatible impide iniciar hasta corregirla o desconectar NZBGet. qBittorrent y los clientes con otros nombres siguen siendo independientes. Notas: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
    de_DE:
      'NZBGet verbinden mit automatisch geteilten eingeschränkten Zugangsdaten und dem Importordner für abgeschlossene Downloads hinzugefügt. NZBGets Dateimanager unter Medienspeicher auswählen; ein unpassender Ordner verhindert den Start bis zur Korrektur oder Trennung von NZBGet. qBittorrent und anders benannte Clients bleiben unabhängig. Hinweise: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
    pl_PL:
      'Dodano Połącz NZBGet z automatycznie udostępnianymi ograniczonymi danymi logowania i folderem importu ukończonych pobrań. Wybierz menedżera plików NZBGet w Magazynie multimediów; niezgodny folder blokuje uruchomienie do czasu poprawienia lub odłączenia NZBGet. qBittorrent i klienci o innych nazwach pozostają niezależni. Informacje: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
    fr_FR:
      'Ajout de Connecter NZBGet avec identifiants restreints partagés automatiquement et son dossier d’import des téléchargements terminés. Sélectionnez son gestionnaire de fichiers dans Stockage multimédia ; un dossier incompatible bloque le démarrage jusqu’à correction ou déconnexion de NZBGet. qBittorrent et les clients portant d’autres noms restent indépendants. Notes : https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
  },
  migrations: { up: async () => {}, down: IMPOSSIBLE },
})
