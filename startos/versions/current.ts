import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const current = VersionInfo.of({
  version: '2026.11.16.1:2',
  releaseNotes: {
    en_US:
      'Added Connect NZBGet with automatically shared restricted credentials and its completed-download import folder. Select NZBGet’s file manager in Media Storage; a mismatched folder blocks startup until corrected or NZBGet is disconnected. qBittorrent and manually named clients remain independent. Shelfarr follows qBittorrent’s shared download location without changing its default; the exact-folder setup task and Shelfarr’s Download Folder input are removed. Update qBittorrent before connecting. Existing files are not moved. Upstream notes: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
    es_ES:
      'Se añadió Conectar NZBGet con credenciales restringidas compartidas automáticamente y su carpeta de importación de descargas completadas. Selecciona su gestor de archivos en Almacenamiento multimedia; una carpeta incompatible impide iniciar hasta corregirla o desconectar NZBGet. qBittorrent y los clientes con otros nombres siguen siendo independientes. Shelfarr sigue la ubicación compartida de qBittorrent sin cambiar su carpeta predeterminada; se eliminan la tarea de carpeta exacta y el campo Carpeta de descargas de Shelfarr. Actualiza qBittorrent antes de conectarlo. No se mueven archivos existentes. Notas: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
    de_DE:
      'NZBGet verbinden mit automatisch geteilten eingeschränkten Zugangsdaten und dem Importordner für abgeschlossene Downloads hinzugefügt. NZBGets Dateimanager unter Medienspeicher auswählen; ein unpassender Ordner verhindert den Start bis zur Korrektur oder Trennung von NZBGet. qBittorrent und anders benannte Clients bleiben unabhängig. Shelfarr folgt qBittorrents gemeinsamem Download-Ordner, ohne dessen Standard zu ändern; die Aufgabe für einen exakten Ordner und Shelfarrs Download-Ordner-Eingabe entfallen. qBittorrent vor dem Verbinden aktualisieren. Bestehende Dateien werden nicht verschoben. Hinweise: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
    pl_PL:
      'Dodano Połącz NZBGet z automatycznie udostępnianymi ograniczonymi danymi logowania i folderem importu ukończonych pobrań. Wybierz menedżera plików NZBGet w Magazynie multimediów; niezgodny folder blokuje uruchomienie do czasu poprawienia lub odłączenia NZBGet. qBittorrent i klienci o innych nazwach pozostają niezależni. Shelfarr śledzi wspólną lokalizację pobierania qBittorrent bez zmiany jego ustawienia domyślnego; usunięto zadanie wymagające konkretnego folderu i pole Folder pobierania w Shelfarr. Zaktualizuj qBittorrent przed połączeniem. Istniejące pliki nie są przenoszone. Informacje: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
    fr_FR:
      'Ajout de Connecter NZBGet avec identifiants restreints partagés automatiquement et son dossier d’import des téléchargements terminés. Sélectionnez son gestionnaire de fichiers dans Stockage multimédia ; un dossier incompatible bloque le démarrage jusqu’à correction ou déconnexion de NZBGet. qBittorrent et les clients portant d’autres noms restent indépendants. Shelfarr suit le dossier de téléchargement partagé de qBittorrent sans modifier sa valeur par défaut ; la tâche imposant un dossier précis et le champ Dossier de téléchargement de Shelfarr sont supprimés. Mettez qBittorrent à jour avant de le connecter. Les fichiers existants ne sont pas déplacés. Notes : https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
  },
  migrations: {
    up: async ({ effects }) => {
      await sdk.action.clearTask(effects, 'qbittorrent:set-download-location')
    },
    down: IMPOSSIBLE,
  },
})
