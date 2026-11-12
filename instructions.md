# Shelfarr

## Documentation

- [Settings reference](https://shelfarr.org/configuration.html) — upstream configuration options.
- [REST API](https://github.com/Pedro-Revez-Silva/shelfarr/blob/main/docs/api.md) — authentication tokens and endpoints.

## What you get on StartOS

Use **Web UI** for Shelfarr and its API. StartOS provides an admin-password action, shared file-manager storage, and optional connections to local Prowlarr, qBittorrent and Audiobookshelf.

## Getting set up

1. Complete **Set Admin Password** and save the generated credentials.
2. Complete **Media Storage**. Choose FileBrowser Quantum, NextExplorer, or both, and set separate audiobook, ebook and comic output folders plus a download folder beneath the selected storage. FileBrowser Quantum uses `/mnt/filebrowser`; NextExplorer uses `/mnt/nextexplorer/<location>`, for example `/mnt/nextexplorer/Files/Shelfarr/ebooks`. The selected file manager must be installed.
3. Open **Web UI** and sign in as `admin`. Configure metadata and acquisition sources in Shelfarr's admin settings. Google Books and Open Library are available without a Hardcover account; other sources may require your own credentials.
4. For local indexers, run **Connect Prowlarr** here. Configure your indexers in Prowlarr first. Shelfarr searches them directly; do not add Shelfarr to Prowlarr's **Connect Apps** or try to register it as Readarr. Use a Prowlarr package that supports Shelfarr's automatic connection.
5. For local torrents, run **Connect qBittorrent** here. Complete the resulting **Set Download Location** task on qBittorrent to use the exact **Download Folder** from **Media Storage**. This changes qBittorrent’s default download location, including for other clients that use its default. Keep the managed client’s category save path empty or inside this folder, not in qBittorrent’s private storage. Both apps see identical paths, so no remote-path mapping is needed. The managed client starts with category `shelfarr`, which you can change in Shelfarr. Existing torrents are not moved; torrents already in private storage need moving separately in qBittorrent.
6. For Audiobookshelf, enable the same file manager in its **External Libraries** action and include Shelfarr’s output folders. Create audiobook, ebook and/or comic libraries in Audiobookshelf pointing to those exact shared paths, such as `/mnt/filebrowser/Shelfarr/audiobooks`. Create an API key in Audiobookshelf under **Settings > API Keys** with access to those libraries and permission to scan them. Run **Configure Audiobookshelf** here, enable the connection, paste the token, and copy each library ID from its Audiobookshelf URL. Leave unused formats blank; comics use the ebook library if no comic library is selected. Shelfarr matches existing items, syncs inventory and requests scans after imports. Other library platforms remain manually configured in Shelfarr.

Use only sources and content you are authorized to access.

## Managing the service

- Run **Reset Admin Password** for a replacement password. Wait for Shelfarr to finish restarting before signing in; existing admin sessions are revoked. Your two-factor authenticator is still required if enabled.
- Use **Media Storage** to change mounts, output folders or the managed download folder. This does not move existing books. Changing paths may require moving files and repairing library references separately.
- The connection actions become **Disconnect Prowlarr** or **Disconnect qBittorrent** while enabled. Disconnecting Prowlarr clears its managed URL and key; disconnecting qBittorrent removes only the client named `qBittorrent (StartOS)`.
- Use **Configure Audiobookshelf** to update its token and library IDs or disable the connection. Disabling clears its managed URL and token without deleting books or libraries. API-token expiry or revocation requires a replacement token.
- Configure other download clients and upstream features in Shelfarr itself. Keep package-managed credentials and output paths in the StartOS actions rather than changing them in Shelfarr.
- Back up your file managers separately: Shelfarr's own backup does not include shared book libraries or downloads.

If you publish Shelfarr through a tunnel to hide your home IP, send its outbound traffic through that tunnel too. Metadata providers, indexers and download sources otherwise see your usual outbound IP. Nothing needs changing if the tunnel is only for reachability.

## Limitations

The optional beta Audible Backup/Libation companion is not included. Removing selected file-manager storage prevents Shelfarr from starting until you reinstall it or change **Media Storage**.
