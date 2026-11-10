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

Before opening the listener, the `bootstrap` oneshot runs the upstream entrypoint with `rails db:prepare` and a Rails runner that reconciles the admin, output paths, and managed integrations. It does not write password hashes or encrypted database values directly. The `trust-ca` oneshot installs this StartOS server's root CA for manually configured HTTPS integrations. The entrypoint manages storage ownership using uid/gid 1000.

## Volume and Data Layout

Application state and package state use separate volumes. Output libraries and completed downloads use selected file-manager volumes, not the app volume.

| Volume                     | Mount                           | Contents                                                                                |
| -------------------------- | ------------------------------- | --------------------------------------------------------------------------------------- |
| `main/storage`             | `/rails/storage`                | SQLite databases, uploads, attachments, generated signing and encryption keys           |
| `main/tmp`                 | `/rails/tmp`                    | Disk-backed temporary files, staging and cached download archives; `TMPDIR` points here |
| `startos`                  | Unmounted                       | `store.json` containing credentials and selections                                      |
| FileBrowser Quantum `data` | `/mnt/filebrowser`, read-write  | Shared libraries and downloads                                                          |
| NextExplorer `data`        | `/mnt/nextexplorer`, read-write | Shared libraries and downloads, one directory per location                              |
| qBittorrent `main/share`   | `/mnt/qbittorrent`, read-only   | Shared API key, while connected and installed                                           |
| Prowlarr `startos/share`   | `/mnt/prowlarr`, read-only      | Shared API key, while connected and installed                                           |

The own storage mount masks any files baked into the image's storage directory; fresh installations generate their own keys. Media mount paths match qBittorrent. A download and output path on one mounted filesystem can support hardlinks; different file managers cannot share them.

## File Models

`startos/store.json` is the only file model. Install merges schema defaults; actions update the admin password, media-source selection, three output paths, and connection selections. The entire modeled state is watched by `main`; edits restart the service.

Every start reconciles the `admin` password and role, password authentication, and output paths through upstream models. A changed password also clears lockout and revokes admin sessions; two-factor configuration is preserved. Managed output paths overwrite conflicting UI changes at the next start. Other upstream settings remain in SQLite and are not modeled or rewritten by the package.

Prowlarr selection begins unset, leaving manual indexer settings alone. Connecting manages its URL, key and provider; disconnecting clears its URL/key and changes the provider to `none` if Prowlarr was active. While disconnected, these fields remain cleared on startup. The managed qBittorrent record has the reserved name `qBittorrent (StartOS)`; connection fields and enabled state are package-owned, while category and routing choices remain user-controlled. Disconnecting deletes that record, not manually named clients.

## Dependencies

All dependencies are optional selections. At least one file manager must be selected; selected storage must be installed before startup, preventing output files from falling onto an unmounted container path.

FileBrowser Quantum and NextExplorer are `exists` dependencies with read-write data mounts. Prowlarr and qBittorrent are `running` dependencies with `primary` health expectations and read-only key mounts. Their bridge addresses and shared keys are watched reactively. Missing downloader/indexer addresses or keys leave existing application settings untouched, and installing the dependency later re-runs startup reconciliation. Dependency declarations warn about availability rather than gating the listener themselves.

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

## Tasks

Two reactive critical prompts block startup while setup is incomplete. The password prompt is raised while `adminPassword` is null and clears when generated. The storage prompt is raised while `mediaSources` is empty and clears when storage is selected. Either can return if its stored value is cleared.

## Health Checks

The `primary` Web Interface check probes `/up` on port 5056 using the SDK's default grace period. It indicates that Rails responds, not that an external metadata provider, indexer, or download client works.

A failed bootstrap prevents the listener starting. Check logs for schema preparation errors, inaccessible shared output directories, or invalid integration credentials. A ready web check is not proof of successful book acquisition or background-job completion.

## Backups and Restore

StartOS stops Shelfarr and copies `main` and `startos`; quiescent SQLite databases and the generated encryption keys are captured together. `/tmp` within the own volume is excluded as temporary and derived data. In-flight temporary work may need retrying after restore.

Mounted dependency volumes are not captured. File managers and download clients must be backed up separately; a restored database alone does not restore its library files. On restart, current dependency addresses and keys replace stored connection details.

## Limitations and Differences

The package deliberately manages access, storage and local connection details.

1. No local media library or access to qBittorrent-private downloads is provided. Output directories must be beneath selected shared storage; removing selected storage prevents startup until repaired.
2. Output folders, the reserved admin login, password authentication and selected integration details are reapplied at startup. Conflicting application edits do not survive restart.
3. The beta Libation/Audible companion is not bundled. Audiobookshelf and other library-platform connections are configured manually and need compatible shared paths.
4. Provider availability remains external. No downloader, metadata server or challenge-solving browser is bundled.
5. No riscv64 image is available. Recover from an older backup rather than attempting a database downgrade.

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
dependencies: [filebrowser, nextexplorer, qbittorrent, prowlarr]
interfaces:
  ui: { host_id: ui-multi, type: ui, port: 5056, protocol: http }
actions:
  [set-admin-password, media-storage, connect-prowlarr, connect-qbittorrent]
tasks:
  - { action: set-admin-password, severity: critical }
  - { action: media-storage, severity: critical }
health_checks: [primary]
oneshots: [trust-ca, bootstrap]
```
