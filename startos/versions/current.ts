import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.11.9.1:1',
  releaseNotes: {
    en_US:
      'Added a local Audiobookshelf connection and shared-download configuration for qBittorrent. Configure Audiobookshelf with its API token and library IDs; use shared file-manager storage for both services. After updating, complete qBittorrent’s download-location task. It changes qBittorrent’s default folder, including for other clients using that default; move existing private downloads separately if needed.',
    es_ES:
      'Se añadió una conexión local a Audiobookshelf y la configuración de descargas compartidas para qBittorrent. Configura Audiobookshelf con su token API y los identificadores de biblioteca; usa almacenamiento compartido del gestor de archivos en ambos servicios. Tras actualizar, completa la tarea de ubicación de descargas de qBittorrent. Cambia su carpeta predeterminada, también para otros clientes que la usan; mueve las descargas privadas existentes por separado si hace falta.',
    de_DE:
      'Lokale Audiobookshelf-Verbindung und gemeinsame Download-Konfiguration für qBittorrent hinzugefügt. Audiobookshelf mit API-Token und Bibliotheks-IDs konfigurieren; in beiden Diensten gemeinsamen Dateimanager-Speicher verwenden. Nach dem Update die Download-Ort-Aufgabe von qBittorrent abschließen. Sie ändert dessen Standardordner auch für andere Clients mit Standardpfad; bestehende private Downloads bei Bedarf separat verschieben.',
    pl_PL:
      'Dodano lokalne połączenie z Audiobookshelf i konfigurację wspólnych pobrań dla qBittorrent. Skonfiguruj Audiobookshelf tokenem API i identyfikatorami bibliotek; w obu usługach używaj wspólnego magazynu menedżera plików. Po aktualizacji wykonaj zadanie lokalizacji pobierania qBittorrent. Zmienia ono domyślny folder także dla innych klientów używających ustawienia domyślnego; w razie potrzeby przenieś istniejące prywatne pobrania osobno.',
    fr_FR:
      'Ajout d’une connexion locale à Audiobookshelf et de la configuration des téléchargements partagés pour qBittorrent. Configurez Audiobookshelf avec son jeton API et les identifiants des bibliothèques ; utilisez le stockage partagé du gestionnaire de fichiers dans les deux services. Après la mise à jour, effectuez la tâche d’emplacement de téléchargement de qBittorrent. Elle modifie son dossier par défaut, y compris pour les autres clients utilisant cette valeur ; déplacez séparément les téléchargements privés existants si nécessaire.',
  },
  migrations: { up: async () => {}, down: IMPOSSIBLE },
})
