import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.11.16.1:0',
  releaseNotes: {
    en_US:
      'Updated Shelfarr to 2026.11.16.1. Books you already own under a different metadata provider are no longer requested again, Z-Library results download even when the lookup hits a bot check, and several dependencies receive security fixes. Full notes: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
    es_ES:
      'Shelfarr actualizado a 2026.11.16.1. Los libros que ya tienes con otro proveedor de metadatos ya no se vuelven a solicitar, los resultados de Z-Library se descargan aunque la búsqueda encuentre una comprobación antibots, y varias dependencias reciben correcciones de seguridad. Notas: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
    de_DE:
      'Shelfarr auf 2026.11.16.1 aktualisiert. Bücher, die du bereits über einen anderen Metadatenanbieter besitzt, werden nicht mehr erneut angefordert, Z-Library-Ergebnisse werden auch dann heruntergeladen, wenn die Suche auf eine Bot-Prüfung stößt, und mehrere Abhängigkeiten erhalten Sicherheitskorrekturen. Hinweise: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
    pl_PL:
      'Zaktualizowano Shelfarr do 2026.11.16.1. Książki, które już masz u innego dostawcy metadanych, nie są ponownie zamawiane, wyniki z Z-Library pobierają się nawet wtedy, gdy wyszukiwanie trafi na zabezpieczenie przed botami, a kilka zależności otrzymało poprawki bezpieczeństwa. Informacje: https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
    fr_FR:
      'Shelfarr mis à jour vers 2026.11.16.1. Les livres que vous possédez déjà sous un autre fournisseur de métadonnées ne sont plus redemandés, les résultats Z-Library se téléchargent même lorsque la recherche se heurte à une vérification anti-robots, et plusieurs dépendances reçoivent des correctifs de sécurité. Notes : https://github.com/Pedro-Revez-Silva/shelfarr/releases/tag/v2026.11.16.1',
  },
  migrations: { up: async () => {}, down: IMPOSSIBLE },
})
