# Updating Shelfarr

1. Check stable server releases at <https://github.com/Pedro-Revez-Silva/shelfarr/releases>. Ignore Android releases, the Android catalog and prereleases.
2. Read the release notes and inspect the tagged Dockerfile, entrypoint, schema changes, settings service and account model for changes to storage paths, encryption, credentials and integration formats.
3. Verify the new `ghcr.io/pedro-revez-silva/shelfarr` OCI tag exists and supports amd64 and arm64. Server release `vYYYY.MM.DD.N` uses image tag `YYYY.MM.DD.N` without `v`; never pin `latest`.
4. Update `startos/manifest/index.ts` and `startos/versions/current.ts`. Keep all four upstream version components; ExVer normalizes leading zeroes, while the Docker tag retains them. Reset the downstream revision for an upstream update.
5. Before wrapper-only revisions, check the configured reference registry with `start-cli registry package get shelfarr short --format json` and inspect open PRs for version collisions. Do not create another version file unless the outgoing version contains a nonempty migration.
6. Refresh package dependencies and the SDK, preserving one SDK through the override. Prowlarr's package must expose its key at `public/api-key` and retain the exported bridge host/port contract.
7. Verify typechecking, formatting and the package build. Exercise first admin creation before listener exposure, password rotation and session revocation, output-path persistence, restart, and both connection toggles. For upstream schema changes, test restoring an older backup; do not promise downgrade safety.
8. Summarize user-visible changes and link the stable server release in all release-note locales. Keep README and instructions aligned with changed behavior.
