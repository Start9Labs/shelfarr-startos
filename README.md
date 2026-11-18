<p align="center">
  <img src="icon.png" alt="Shelfarr Logo" width="21%">
</p>

# Shelfarr on StartOS

> Everything not listed in this document should behave the same as upstream
> Shelfarr. If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable — see the Documentation section
> of `instructions.md` for links.

[Shelfarr](https://github.com/Pedro-Revez-Silva/shelfarr) manages ebook and audiobook requests and acquisition.

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

## Image and Container Runtime

The unmodified upstream `ghcr.io/pedro-revez-silva/shelfarr` image supports x86_64 and aarch64. `shelfarr-sub` runs the image's entrypoint and default Thruster/Puma server command as PID 1; `SOLID_QUEUE_IN_PUMA=1` keeps the job supervisor with the web service.

Before opening the listener, the `bootstrap` oneshot runs the upstream entrypoint with `rails db:prepare` and a Rails runner that reconciles the admin, output paths, and managed integrations. It does not write password hashes or encrypted database values directly. The `trust-ca` oneshot installs this StartOS server's root CA for manually configured HTTPS integrations. The `prepare-media` oneshot creates missing output directories as uid/gid 1000 before Rails drops privileges; existing shared-directory ownership and permissions are preserved. The entrypoint manages the app's own storage ownership using uid/gid 1000.

## Volume and Data Layout

Application state and package state use separate volumes. Output libraries and completed downloads use selected file-manager volumes, not the app volume.

| Volume                     | Mount                           | Contents                                                                                |
| -------------------------- | ------------------------------- | --------------------------------------------------------------------------------------- |
| `main/storage`             | `/rails/storage`                | SQLite databases, uploads, attachments, generated signing and encryption keys           |
| `main/tmp`                 | `/rails/tmp`                    | Disk-backed temporary files, staging and cached download archives; `TMPDIR` points here |
| `startos`                  | Unmounted                       | `store.json` containing credentials and selections                                      |
| FileBrowser Quantum `data` | `/mnt/filebrowser`, read-write  | Shared libraries and downloads                                                          |
| NextExplorer `data`        | `/mnt/nextexplorer`, read-write | Shared libraries and downloads, one directory per location                              |
| qBittorrent `public`       | `/mnt/qbittorrent`, read-only   | Shared API key and download-location export, while connected and installed              |
| NZBGet `public`            | `/mnt/nzbget`, read-only        | Restricted credentials and completed-download root, while connected and installed      |
| Prowlarr `public`          | `/mnt/prowlarr`, read-only      | Shared API key, while connected and installed                                           |
| Audiobookshelf `public`    | `/mnt/audiobookshelf`, read-only | Automatically provisioned API key while connected and installed                        |

The own storage mount masks any files baked into the image's storage directory; fresh installations generate their own keys. Media mount paths must match qBittorrent and NZBGet. A download and output path on one mounted filesystem can support hardlinks; different file managers cannot share them.

## File Models

`startos/store.json` is the only file model. Install merges schema defaults; actions update the admin password, media-source selection, three output paths and connection selections. The entire modeled state is watched by `main`; edits restart the service.

Every start reconciles the `admin` password and role, password authentication, and output paths through upstream models. A changed password also clears lockout and revokes admin sessions; two-factor configuration is preserved. Managed output paths overwrite conflicting UI changes at the next start. Other upstream settings remain in SQLite and are not modeled or rewritten by the package.

Prowlarr selection begins unset, leaving manual indexer settings alone. Connecting manages its URL, key and provider; disconnecting clears its URL/key and changes the provider to `none` if Prowlarr was active. While disconnected, these fields remain cleared on startup. The managed qBittorrent record has the reserved name `qBittorrent (StartOS)`; client type, connection fields, download folder and enabled state are package-owned, while category and routing choices remain user-controlled. The completed-download import root follows qBittorrent's `public/download-location.json` reactively. qBittorrent owns that location; Shelfarr never changes its global default or submits a save-path override. Matching mount paths make remote-path translation unnecessary. Existing torrents are not relocated. Disconnecting deletes that record, not manually named clients.

The independently managed `NZBGet (StartOS)` record uses client type `nzbget`, its bridge URL, restricted username/password and the completed-download root from NZBGet's `public/credentials.json`; its API-key field is cleared. These fields and enabled state are reapplied on startup. The credentials are not NZBGet's admin login and are never copied into `store.json`. NZBGet's exported root owns this client's `download_path` independently of qBittorrent. A new record gets priority zero and category `shelfarr`, which NZBGet seeds; later category, priority and routing choices remain user-owned. Both downloaders share one bootstrap reconciliation loop. Repeated starts reuse each reserved name; disconnect deletes only that record. Manually named clients with other names are untouched. Missing NZBGet addresses, credentials or an unselected download location leave its existing record unchanged.

Audiobookshelf selection begins unset, preserving manual library-platform settings. **Configure Audiobookshelf** stores audiobook, ebook and comic library IDs, resolves the local bridge address, reads the automatically provisioned `public/api-key` reactively, and selects Audiobookshelf as the active library platform. No API-token input is accepted or stored in the package’s desired-state model. The credential is cached by the upstream application in SQLite as required by its integration. Empty format IDs clear the corresponding managed setting; comics fall back to the ebook library upstream. Additional scan-library IDs remain user-controlled, but are cleared when switching from another platform to avoid reusing that platform’s IDs. Disabling clears the managed URL and token on every start, preventing reconnects without overwriting another platform’s credentials. An unavailable bridge leaves existing application settings untouched. A missing or withdrawn export from an available Audiobookshelf clears Shelfarr’s managed URL/token, preventing reuse of a cached credential; a new export restarts reconciliation automatically. No private Audiobookshelf volume is mounted or modified.

## Dependencies

All dependencies are optional selections. At least one file manager must be selected; selected storage must be installed before startup, preventing output files from falling onto an unmounted container path.

FileBrowser Quantum and NextExplorer are `exists` dependencies with read-write data mounts. Their daemons need not have been started or remain running: missing output folders are prepared independently, without recursively changing shared data ownership. Audiobookshelf, Prowlarr, qBittorrent and NZBGet are `running` dependencies with `primary` health expectations and read-only credential mounts. Their bridge addresses and consumed credentials are watched reactively. Both downloaders publish their import roots, which are watched and reapplied when changed. Unrelated export fields do not restart Shelfarr. Each downloader's file manager must be included in Media Storage. An available root outside selected storage blocks startup until that selection is corrected or the downloader is disconnected; the package never fabricates an import path.

Audiobookshelf requires its automatic credential-export package and also expects the `integrations` health check. While connected, a critical task requests **Service Integrations** with `integrationsEnabled: true`. It is opt-in because upstream library scans require administrator API access; the exported account is a dedicated non-root admin, not a scan-only security boundary. Disabling the Shelfarr connection hides this task but does not revoke credentials used by other services; use Audiobookshelf’s action to revoke the shared credential globally. While connected, disabling Service Integrations re-arms the task and keeps Shelfarr stopped until integrations are re-enabled or the connection is disabled; **Configure Audiobookshelf** runs while Shelfarr is stopped. Missing downloader/indexer addresses or keys leave existing application settings untouched, and installing the dependency later re-runs startup reconciliation. Dependency declarations warn about availability rather than gating the listener themselves.

qBittorrent must provide its public download-location export. Its shared folder may be anywhere beneath selected file-manager storage, separate from Shelfarr's output libraries. Private local storage is exported as a null root and cannot be imported. An available qBittorrent with a key but no accessible exported root blocks startup; **Media Storage** and **Disconnect qBittorrent** remain available to repair the selection. No qBittorrent configuration task is created. Category-specific paths must remain beneath the exported download root. Upstream imports copy by default; hardlink and move modes remain user-controlled. Hardlinks require downloads and outputs on the same mounted filesystem.

## Network Access and Interfaces

One HTTP listener serves the web UI and authenticated REST API. The exported interface is `ui`, type `ui`, on port 5056 under host `ui-multi`; `uiPort` and `uiHostId` are exported from `startos/utils.ts`.

## Installation and First-Run Flow

Critical prompts require an admin password and shared storage before startup. Bootstrap creates or reconciles `admin` before any web listener opens, closing upstream's first-visitor admin registration flow. Additional accounts remain administered inside Shelfarr.

Restores retain credentials, keys, selections and databases. Upstream schema preparation runs on startup, including after upgrades; downgrades are not declared safe.

## Actions

The actions change the stored desired state. While running, changed state restarts Shelfarr; while stopped it applies on the next start.

- **Set/Reset Admin Password** is for first access or recovery. It returns a masked, copyable generated password and username. Repetition deliberately rotates the password; allow startup reconciliation to complete before logging in. It does not remove two-factor authentication.
- **Media Storage** changes mounts and output directories without moving or deleting existing books. Repeating the same selection is safe. Removing or changing a directory can leave existing library records pointing to unavailable files; files must be moved separately when desired.
- **Connect/Disconnect Prowlarr** changes the direct-search integration. Each invocation toggles the selection, so a second invocation reverses the first. There is no Prowlarr application-sync registration.
- **Connect/Disconnect qBittorrent** manages only the reserved client record. Each invocation toggles the selection; reconciliation reuses its unique name rather than creating duplicates.
- **Connect/Disconnect NZBGet** manages Usenet downloads independently of qBittorrent, after configuring NZBGet's news server and download location. It toggles `nzbgetConnected`; each invocation reverses selection and costs a restart when running. Reconciliation reuses the reserved client rather than duplicating it. Disconnect deletes the managed record, not downloaded files or clients with other names. No credential or separate import-root input is required; NZBGet supplies both automatically. Resetting its admin password requires no reconnection.
- **Configure Audiobookshelf** enables or disables the local connection and edits its library IDs; the API credential comes from Audiobookshelf automatically. Repeating the same configuration is safe. Enable the same file-manager folders in Audiobookshelf’s **External Libraries**, then create libraries pointing at Shelfarr’s output paths. Changed connection settings enqueue an immediate inventory sync; unchanged restarts do not enqueue duplicates. Shelfarr uses upstream library matching, inventory sync, and post-import scans; this action does not create libraries or change Audiobookshelf mounts.

## Tasks

Two reactive critical prompts block startup while setup is incomplete. The password prompt is raised while `adminPassword` is null and clears when generated. The storage prompt is raised while `mediaSources` is empty and clears when storage is selected. Either can return if its stored value is cleared. Audiobookshelf also carries the critical service-integration task described above.

## Health Checks

The `primary` Web Interface check probes `/up` on port 5056 using the SDK's default grace period. It indicates that Rails responds, not that an external metadata provider, indexer, or download client works.

A failed bootstrap prevents the listener starting. Check logs for schema preparation errors, inaccessible shared output directories, or invalid integration credentials. A ready web check is not proof of successful book acquisition or background-job completion.

## Backups and Restore

StartOS stops Shelfarr and copies `main` and `startos`; quiescent SQLite databases and the generated encryption keys are captured together. `/tmp` within the own volume is excluded as temporary and derived data. In-flight temporary work may need retrying after restore.

Mounted dependency volumes are not captured. File managers and download clients must be backed up separately; a restored database alone does not restore its library files. On restart, current dependency addresses and credentials replace stored connection details, including both downloaders' published import roots.

## Limitations and Differences

The package deliberately manages access, storage and local connection details.

1. No local media library or access to qBittorrent-private downloads is provided. Output directories must be beneath selected shared storage; removing selected storage prevents startup until repaired.
2. Output folders, the reserved admin login, password authentication and selected integration details are reapplied at startup. Conflicting application edits do not survive restart.
3. The beta Libation/Audible companion is not bundled. Audiobookshelf requires its Service Integrations opt-in, library IDs and matching shared folders; credentials are provided automatically. Other library platforms remain manually configured.
4. Provider availability remains external. No downloader, metadata server or challenge-solving browser is bundled.
5. No riscv64 image is available. Recover from an older backup rather than attempting a database downgrade.
6. The `NZBGet (StartOS)` client's type, URL, restricted login, cleared API key, import root and enabled state are package-managed. Changing its download root in Shelfarr does not persist; change NZBGet's location and include that file manager in Media Storage. Other client settings remain user-owned.

## Quick Reference for AI Consumers

This summary lists the package's operating surface without duplicating version pins.

```yaml
package_id: shelfarr
image: ghcr.io/pedro-revez-silva/shelfarr
architectures: [x86_64, aarch64]
subcontainers: [shelfarr-sub]
volumes:
  main: /rails/storage and /rails/tmp
  startos: unmounted store.json
file_models: [startos/store.json]
startos_managed_env_vars:
  [
    PUID,
    PGID,
    TZ,
    HTTP_PORT,
    TMPDIR,
    DISABLE_AUTH,
    SOLID_QUEUE_IN_PUMA,
    STARTOS_BOOTSTRAP,
    STARTOS_CONFIG,
  ]
dependencies: [filebrowser, nextexplorer, qbittorrent, nzbget, prowlarr, audiobookshelf]
interfaces:
  ui: { host_id: ui-multi, type: ui, port: 5056, protocol: http }
actions:
  [set-admin-password, media-storage, connect-prowlarr, connect-qbittorrent, connect-nzbget, connect-audiobookshelf]
tasks:
  - { action: set-admin-password, severity: critical }
  - { action: media-storage, severity: critical }
  - { package: audiobookshelf, action: service-integrations, severity: critical, when: connected }
health_checks: [primary]
oneshots: [trust-ca, prepare-media, bootstrap]
```
