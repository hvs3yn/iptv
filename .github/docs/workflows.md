# Workflows

To automate running the [scripts](./scripts.md), we use [GitHub Actions workflows](https://docs.github.com/en/actions/using-workflows).

Each workflow includes its own set of scripts that can be run either manually or in response to a repository event.

## check

Sequentially runs the `api:load`, `playlist:lint`, and `playlist:validate` scripts whenever a new pull request is opened, blocking the merge if it detects any errors.

## format

Sequentially runs the `api:load`, `playlist:format`, `playlist:lint`, and `playlist:validate` scripts.

## update

Runs every day at 0:00 UTC. It sequentially executes the `api:load`, `playlist:update`, `playlist:lint`, `playlist:validate`, `playlist:generate`, `playlist:export`, and `readme:update` scripts, then automatically deploys the updated files if successful. Deploy steps only run in the upstream `iptv-org/iptv` repository.

## Fork-specific workflows

### sync

Runs every 6 hours. Merges upstream `iptv-org/iptv` into this fork, resolving conflicts in favor of upstream while restoring fork-owned files (build configs, generated playlists, custom workflows) afterwards.

### Build Playlist / Build Sports Playlist

Run every 6 hours (staggered after sync). Generate `playlist.m3u` from the sources listed in `playlist-filter.conf` and `playlist-sports.m3u` from all sport channels, then commit the result. All three scheduled workflows share the `push-master` concurrency group so their pushes never race.

### AI Review

Reviews the repository with an AI agent and proposes fixes via Pull Request. Never pushes to `master`. See [ai-review.md](./ai-review.md) for details.
