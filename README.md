# MCAT - Download ALL THE MUSIC

This tool interfaces with the Monster Cat connect API and allows you to download their entire collection.

## Usage:


Select all the good stuff: `mcat syncCatalog && mcat select --uniq-track --no-long-mix --no-remix > things-to-download.json`

Count tracks released after a date `mcat select --after 10-10-2017 --count`

Download the selected items `mcat download < things-to-download.json`

Import the downloaded tracks to iTunes `things-to-download.json > mcat import | sh`


Main Help:
```
CLI tool to interface with the MonsterCat Connect API.

This tool is best used for syncing a target group of tracks with your local machiene (i.e. iTunes).

Commands:

  auth            - Create a session with the MonsterCat Connnect service.
  session         - Check the status of the current session.
  syncCatalog     - Syncs MonsterCat's entire catalog to the local cache.
  select          - Selects a set of tracks from the cache using the given options.
  download        - Downloads the tracks the specified file.
  importItunes    - Imports the paths into iTunes.
  logOut          - Destroys the current session.
  help            - Prints this help text.
```

Select Help:

```
Filters songs from the cached MonsterCat Catalog.

Options:

  --count           - Only outputs the count of matched entries.
  --schema          - Only outputs the first element to help with filter development.
  --help            - Prints this text.
  --all             - Select every entry
  --uniq-track      - Selects only unique tracks.
  --remix           - Selects only remixes.
  --no-remix        - Excludes remixes
  --long-mix        - Selects only long mixes.
  --no-long-mix     - Excludes long mixes.
  --colab           - Selects only songs that have two or more artists.
  --no-colab        - Selects songs with only one artist.
  --featuring       - Selects only songs which feature an artist.
  --downloadable    - Selects only downloadable songs.
  --early-access    - Selects songs only avalible for early access.
  --after           - Selects songs created after the specified date.
  --before          - Selects songs created before the specified date.
```
