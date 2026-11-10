# Shelfarr

## Documentation

- [Settings reference](https://shelfarr.org/configuration.html) — upstream configuration options.
- [REST API](https://github.com/Pedro-Revez-Silva/shelfarr/blob/main/docs/api.md) — authentication tokens and endpoints.

## What you get on StartOS

Use **Web UI** for Shelfarr and its API. StartOS provides an admin-password action, shared file-manager storage, and optional automatic connections to local Prowlarr and qBittorrent.

## Getting set up

1. Complete **Set Admin Password** and save the generated credentials.
2. Complete **Media Storage**. Choose FileBrowser Quantum, NextExplorer, or both, and set separate audiobook, ebook and comic output folders beneath the selected storage. FileBrowser Quantum uses `/mnt/filebrowser`; NextExplorer uses `/mnt/nextexplorer/<location>`, for example `/mnt/nextexplorer/Files/Shelfarr/ebooks`. The selected file manager must be installed.
3. Open **Web UI** and sign in as `admin`. Configure metadata and acquisition sources in Shelfarr's admin settings. Google Books and Open Library are available without a Hardcover account; other sources may require your own credentials.
4. For local indexers, run **Connect Prowlarr** here. Configure your indexers in Prowlarr first. Shelfarr searches them directly; do not add Shelfarr to Prowlarr's **Connect Apps** or try to register it as Readarr. Use a Prowlarr package that supports Shelfarr's automatic connection.
5. For local torrents, run **Connect qBittorrent** here. In qBittorrent, place completed downloads on storage also selected in Shelfarr. Both apps must see the same file-manager paths; qBittorrent's private download folder is not accessible. The managed client starts with category `shelfarr`, which you can change in Shelfarr.
6. If using a library platform such as Audiobookshelf, configure it manually and ensure its watched folders refer to the same shared files as Shelfarr's output folders.

Use only sources and content you are authorized to access.

## Managing the service

- Run **Reset Admin Password** for a replacement password. Wait for Shelfarr to finish restarting before signing in; existing admin sessions are revoked. Your two-factor authenticator is still required if enabled.
- Use **Media Storage** to change mounts or output folders. This does not move existing books. Changing paths may require moving files and repairing library references separately.
- The connection actions become **Disconnect Prowlarr** or **Disconnect qBittorrent** while enabled. Disconnecting Prowlarr clears its managed URL and key; disconnecting qBittorrent removes only the client named `qBittorrent (StartOS)`.
- Configure other download clients and upstream features in Shelfarr itself. Keep package-managed credentials and output paths in the StartOS actions rather than changing them in Shelfarr.
- Back up your file managers separately: Shelfarr's own backup does not include shared book libraries or downloads.

If you publish Shelfarr through a tunnel to hide your home IP, send its outbound traffic through that tunnel too. Metadata providers, indexers and download sources otherwise see your usual outbound IP. Nothing needs changing if the tunnel is only for reachability.

## Limitations

The optional beta Audible Backup/Libation companion is not included. Removing selected file-manager storage prevents Shelfarr from starting until you reinstall it or change **Media Storage**.
