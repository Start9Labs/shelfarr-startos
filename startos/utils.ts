import { posix } from 'node:path'
import { Store } from './fileModels/store.json'

export const uiPort = 5056
export const uiHostId = 'ui-multi'
export const adminUsername = 'admin'
// Shared media paths must match qBittorrent, NZBGet and the file managers.
export const mediaMountpoints = {
  filebrowser: '/mnt/filebrowser',
  nextexplorer: '/mnt/nextexplorer',
} as const

export function getDownloadPath(store: Store) {
  return (
    store.downloadPath ||
    posix.join(posix.dirname(store.audiobookPath), 'downloads')
  )
}

export function validMediaPaths(
  sources: Store['mediaSources'],
  paths: string[],
) {
  return paths.every((path) => {
    const normalized = posix.normalize(path).replace(/\/+$/, '')
    return sources.some((source) =>
      normalized.startsWith(`${mediaMountpoints[source]}/`),
    )
  })
}

// Existing shared directories retain their ownership and permissions.
export const prepareMediaScript = `
missing=()
for directory do
  if [ ! -d "$directory" ]; then missing+=("$directory"); fi
done
for directory in "\${missing[@]}"; do
  install -d -o 1000 -g 1000 -- "$directory"
done
`

// Reconcile credentials before the listener opens; registration claims an empty database.
export const bootstrapScript = String.raw`
require "json"
c = JSON.parse(ENV.fetch("STARTOS_CONFIG"))
SettingsService.seed_defaults!
User.transaction do
  user = User.active.find_or_initialize_by(username: "admin")
  password = c.fetch("adminPassword")
  if user.new_record? || !user.authenticate(password)
    user.assign_attributes(name: "Administrator", role: :admin, password: password, password_confirmation: password)
    user.save!
    user.reset_failed_logins!
    user.sessions.destroy_all
  elsif !user.admin?
    user.update!(role: :admin)
  end
end
SettingsService.set(:auth_disabled, false)
{
  audiobook_output_path: c.fetch("audiobookPath"),
  ebook_output_path: c.fetch("ebookPath"),
  comicbook_output_path: c.fetch("comicbookPath")
}.each do |key, path|
  raise "Output folder is not writable: #{path}" unless File.writable?(path)
  SettingsService.set(key, path)
end
if c["prowlarrConnected"] == false
  SettingsService.set(:indexer_provider, "none") if SettingsService.active_indexer_provider == "prowlarr"
  SettingsService.set(:prowlarr_url, "")
  SettingsService.set(:prowlarr_api_key, "")
elsif c["prowlarr"]
  SettingsService.set(:prowlarr_url, c["prowlarr"].fetch("url"))
  SettingsService.set(:prowlarr_api_key, c["prowlarr"].fetch("apiKey"))
  SettingsService.set(:indexer_provider, "prowlarr")
end
# Library IDs are scoped to the selected platform; never reuse another platform's IDs.
if c["audiobookshelf"] == false
  SettingsService.set(:audiobookshelf_url, "")
  SettingsService.set(:audiobookshelf_api_key, "")
elsif c["audiobookshelf"]
  abs = c.fetch("audiobookshelf")
  settings = {
    library_platform: "audiobookshelf",
    audiobookshelf_url: abs.fetch("url"),
    audiobookshelf_api_key: abs.fetch("apiKey")
  }
  {
    audiobook: "audiobookLibraryId",
    ebook: "ebookLibraryId",
    comicbook: "comicbookLibraryId"
  }.each do |format, key|
    settings["audiobookshelf_#{format}_library_id".to_sym] = abs[key].to_s
    if SettingsService.active_library_platform != "audiobookshelf"
      settings["audiobookshelf_#{format}_scan_library_ids".to_sym] = ""
    end
  end
  changed = settings.any? { |key, value| SettingsService.get(key) != value }
  settings.each { |key, value| SettingsService.set(key, value) }
  AudiobookshelfLibrarySyncJob.perform_later if changed
end
[
  ["qBittorrent (StartOS)", c.fetch("qbittorrentConnected"), c["qbittorrent"] && {
    client_type: "qbittorrent",
    url: c["qbittorrent"].fetch("url"),
    api_key: c["qbittorrent"].fetch("apiKey"),
    username: nil,
    password: nil,
    # Managed torrents use shared storage at identical paths in both containers.
    download_path: c.fetch("downloadPath")
  }],
  ["NZBGet (StartOS)", c.fetch("nzbgetConnected"), c["nzbget"] && {
    client_type: "nzbget",
    url: c["nzbget"].fetch("url"),
    username: c["nzbget"].fetch("username"),
    password: c["nzbget"].fetch("password"),
    api_key: nil,
    # The import root must follow NZBGet's published completed-download folder.
    download_path: c["nzbget"].fetch("downloadPath")
  }]
].each do |name, connected, attributes|
  client = DownloadClient.find_by(name: name)
  if !connected
    client&.destroy!
  elsif attributes
    # Must name a category seeded by NZBGet.
    client ||= DownloadClient.new(name: name, priority: 0, category: "shelfarr")
    client.assign_attributes(attributes.merge(enabled: true))
    client.save!
  end
end
`
