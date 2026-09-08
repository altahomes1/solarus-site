# Solarus site — house rules

Marketing site for Solarus, a beachfront condo tower in Galveston, TX, owned by
the Kahlenberg family. Dru Kahlenberg (project lead) edits it and does not code.

## Truth rules
- NEVER invent prices, HOA dues, availability dates, square footages, licenses,
  bios, walk scores or travel times. Leave the field blank / "Price on request"
  and ask Dru instead.
- Unit data comes from Dru only. PH5 sqft and some bed/bath counts are still
  unconfirmed from the old site's data.

## Editing invariant
- EVERY visitor-visible string must be editable from the Decap dashboard
  (/admin -> public/admin/config.yml). If you add a feature with new copy, add
  the matching dashboard fields in the same change.
- Content lives in src/data/**/*.json. Do not hardcode copy in .astro files.

## Build & deploy
- Node is NOT on the system PATH. Use the copy in the session scratchpad or a
  locally installed Node >= 20.
- Deploy: `npm run build && npx wrangler pages deploy dist --project-name solarus --branch main --commit-dirty=true`
- Live test URL: https://solarus.pages.dev - production domain will be
  https://www.solarustower.com (canonical, set in astro.config.mjs).

## Style
- Mobile first: verify at 375px before desktop. Dru reviews on an iPhone.
- Photography: team headshots are black & white.
- See LAUNCH.md for the go-live runbook. X-Robots-Tag noindex in
  public/_headers MUST be removed at launch and never before.
