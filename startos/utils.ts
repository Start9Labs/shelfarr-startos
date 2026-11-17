import { posix } from 'node:path'
import { Store } from './fileModels/store.json'

export const uiPort = 5056
export const uiHostId = 'ui-multi'
export const adminUsername = 'admin'
// Shared media paths match qBittorrent and the file managers.
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
name = "qBittorrent (StartOS)"
client = DownloadClient.find_by(name: name)
if !c.fetch("qbittorrentConnected")
  client&.destroy!
elsif c["qbittorrent"]
  client ||= DownloadClient.new(name: name, priority: 0, category: "shelfarr")
  # Managed torrents use shared storage at identical paths in both containers.
  client.assign_attributes(client_type: "qbittorrent", url: c["qbittorrent"].fetch("url"), api_key: c["qbittorrent"].fetch("apiKey"), enabled: true, username: nil, password: nil, download_path: c.fetch("downloadPath"))
  client.save!
end
`
