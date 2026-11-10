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

export function validMediaPaths(
  sources: Store['mediaSources'],
  paths: string[],
) {
  return paths.every((path) =>
    sources.some((source) =>
      posix.normalize(path).startsWith(`${mediaMountpoints[source]}/`),
    ),
  )
}

// Reconcile credentials before the listener opens; registration claims an empty database.
export const bootstrapScript = String.raw`
require "json"
require "fileutils"
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
  FileUtils.mkdir_p(path)
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
name = "qBittorrent (StartOS)"
client = DownloadClient.find_by(name: name)
if !c.fetch("qbittorrentConnected")
  client&.destroy!
elsif c["qbittorrent"]
  client ||= DownloadClient.new(name: name, client_type: "qbittorrent", priority: 0, category: "shelfarr")
  client.assign_attributes(url: c["qbittorrent"].fetch("url"), api_key: c["qbittorrent"].fetch("apiKey"), enabled: true, username: nil, password: nil)
  client.save!
end
`
