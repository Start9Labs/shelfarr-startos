export const short = {
  en_US: 'Request, download, and organize ebooks and audiobooks',
  es_ES: 'Solicita, descarga y organiza libros electrónicos y audiolibros',
  de_DE: 'E-Books und Hörbücher anfordern, herunterladen und verwalten',
  pl_PL: 'Zamawiaj, pobieraj i porządkuj ebooki oraz audiobooki',
  fr_FR: 'Demandez, téléchargez et organisez ebooks et livres audio',
}

export const long = {
  en_US:
    'Shelfarr manages book requests, searches indexers and direct sources, and organizes completed downloads. This package adds managed admin credentials, shared storage in FileBrowser Quantum or NextExplorer, and optional connections to Prowlarr, qBittorrent and Audiobookshelf. Book discovery uses external metadata providers.',
  es_ES:
    'Shelfarr gestiona solicitudes de libros, busca en indexadores y fuentes directas y organiza las descargas. Este paquete añade credenciales de administrador gestionadas, almacenamiento compartido en FileBrowser Quantum o NextExplorer y conexiones opcionales a Prowlarr, qBittorrent y Audiobookshelf. La búsqueda de libros usa proveedores externos de metadatos.',
  de_DE:
    'Shelfarr verwaltet Buchanfragen, durchsucht Indexer und direkte Quellen und ordnet fertige Downloads. Das Paket bietet verwaltete Administrator-Zugangsdaten, gemeinsamen Speicher in FileBrowser Quantum oder NextExplorer und optionale Verbindungen zu Prowlarr, qBittorrent und Audiobookshelf. Die Buchsuche nutzt externe Metadatenanbieter.',
  pl_PL:
    'Shelfarr zarządza zamówieniami książek, przeszukuje indeksatory i źródła bezpośrednie oraz porządkuje pobrane pliki. Pakiet dodaje zarządzane dane administratora, współdzielony magazyn w FileBrowser Quantum lub NextExplorer i opcjonalne połączenia z Prowlarr, qBittorrent i Audiobookshelf. Wyszukiwanie książek korzysta z zewnętrznych dostawców metadanych.',
  fr_FR:
    'Shelfarr gère les demandes de livres, recherche dans les indexeurs et sources directes et organise les téléchargements terminés. Ce paquet ajoute des identifiants administrateur gérés, un stockage partagé dans FileBrowser Quantum ou NextExplorer et des connexions facultatives à Prowlarr, qBittorrent et Audiobookshelf. La découverte utilise des fournisseurs externes de métadonnées.',
}

const storageDescription = {
  en_US:
    'Optional. Shared book libraries and downloads, selected in Media Storage.',
  es_ES:
    'Opcional. Bibliotecas y descargas compartidas, seleccionadas en Almacenamiento multimedia.',
  de_DE:
    'Optional. Gemeinsame Buchbibliotheken und Downloads, ausgewählt unter Medienspeicher.',
  pl_PL:
    'Opcjonalne. Wspólne biblioteki i pobrania, wybierane w Magazynie multimediów.',
  fr_FR:
    'Facultatif. Bibliothèques et téléchargements partagés, choisis dans Stockage multimédia.',
}

export const dependencyDescriptions = {
  audiobookshelf: {
    en_US:
      'Optional. Library matching and scans enabled with Configure Audiobookshelf.',
    es_ES:
      'Opcional. Coincidencia y escaneo de bibliotecas activados con Configurar Audiobookshelf.',
    de_DE:
      'Optional. Bibliotheksabgleich und Scans, aktiviert mit Audiobookshelf konfigurieren.',
    pl_PL:
      'Opcjonalne. Dopasowanie i skanowanie bibliotek włączane przez Konfiguruj Audiobookshelf.',
    fr_FR:
      'Facultatif. Correspondance et analyse des bibliothèques activées par Configurer Audiobookshelf.',
  },
  filebrowser: storageDescription,
  nextexplorer: storageDescription,
  qbittorrent: {
    en_US: 'Optional. Download client enabled with Connect qBittorrent.',
    es_ES: 'Opcional. Cliente de descargas activado con Conectar qBittorrent.',
    de_DE: 'Optional. Download-Client, aktiviert mit qBittorrent verbinden.',
    pl_PL: 'Opcjonalne. Klient pobierania włączany przez Połącz qBittorrent.',
    fr_FR:
      'Facultatif. Client de téléchargement activé par Connecter qBittorrent.',
  },
  prowlarr: {
    en_US: 'Optional. Direct indexer searches enabled with Connect Prowlarr.',
    es_ES:
      'Opcional. Búsquedas directas en indexadores activadas con Conectar Prowlarr.',
    de_DE: 'Optional. Direkte Indexersuche, aktiviert mit Prowlarr verbinden.',
    pl_PL:
      'Opcjonalne. Bezpośrednie wyszukiwanie w indeksatorach włączane przez Połącz Prowlarr.',
    fr_FR:
      'Facultatif. Recherche directe dans les indexeurs activée par Connecter Prowlarr.',
  },
}
