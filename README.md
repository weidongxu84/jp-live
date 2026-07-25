# JP Live HK

A source-backed calendar of Japanese singers, bands, and voice actors performing in Hong Kong. The current collection covers August through October 2026, with all times in HKT (UTC+8).

## Website

After GitHub Pages is enabled, the published site is available at:

<https://weidongxu84.github.io/jp-live/>

Each monthly section displays the data file's own update date. Event data remains in [events/](events/), so it can be reviewed and updated without a separate database.

## Data and verification

- [August 2026 events](events/2026-08-hong-kong.md)
- [September 2026 events](events/2026-09-hong-kong.md)
- [October 2026 events](events/2026-10-hong-kong.md)
- [Collection plan](COLLECTION_PLAN.md)

Listings link to official artist, promoter, venue, or ticketing sources where possible. Confirm current time, availability, and ticket terms with the linked source before buying tickets or travelling.

## Publishing changes

Pushes to `main` deploy the static site through [`.github/workflows/pages.yml`](.github/workflows/pages.yml). In the repository settings, choose **Settings > Pages > Source: GitHub Actions** once, then GitHub will publish successful workflow runs.