import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'

export const current = VersionInfo.of({
  version: '2026.11.16.1:3',
  releaseNotes: {
    en_US:
      'Configure Audiobookshelf is replaced by Connect Audiobookshelf, which needs no input. Choose audiobook, ebook and comic libraries from the list in Shelfarr’s settings; StartOS no longer overwrites them on restart. Existing connections and library selections are kept.',
    es_ES:
      'Configurar Audiobookshelf se sustituye por Conectar Audiobookshelf, que no requiere datos. Elige las bibliotecas de audiolibros, libros electrónicos y cómics en la lista de la configuración de Shelfarr; StartOS ya no las sobrescribe al reiniciar. Se conservan las conexiones y bibliotecas seleccionadas.',
    de_DE:
      'Audiobookshelf konfigurieren wird durch Audiobookshelf verbinden ersetzt, das keine Eingaben benötigt. Hörbuch-, E-Book- und Comicbibliotheken aus der Liste in den Einstellungen von Shelfarr auswählen; StartOS überschreibt sie beim Neustart nicht mehr. Bestehende Verbindungen und Bibliotheksauswahlen bleiben erhalten.',
    pl_PL:
      'Konfiguruj Audiobookshelf zastąpiono akcją Połącz Audiobookshelf, która nie wymaga danych. Wybierz biblioteki audiobooków, ebooków i komiksów z listy w ustawieniach Shelfarr; StartOS nie nadpisuje ich już przy ponownym uruchomieniu. Istniejące połączenia i wybrane biblioteki zostają zachowane.',
    fr_FR:
      'Configurer Audiobookshelf est remplacé par Connecter Audiobookshelf, qui ne demande aucune saisie. Choisissez les bibliothèques de livres audio, d’ebooks et de bandes dessinées dans la liste des paramètres de Shelfarr ; StartOS ne les écrase plus au redémarrage. Les connexions et bibliothèques sélectionnées sont conservées.',
  },
  migrations: {
    up: async ({ effects }) => {
      await storeJson.update(effects, (store) => {
        if (!store) return null
        const { audiobookshelf, ...rest } = store as typeof store & {
          audiobookshelf?: unknown
        }
        return {
          ...rest,
          audiobookshelfConnected:
            audiobookshelf === false ? false : audiobookshelf ? true : null,
        }
      })
    },
    down: IMPOSSIBLE,
  },
})
