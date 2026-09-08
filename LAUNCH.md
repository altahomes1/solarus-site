# Launch runbook — solarustower.com

Pre-flight (owner supplies):
- [ ] Real sales phone + email -> dashboard Building info (replaces 123-456-7890 / info@solarus.com)
- [ ] Formspree form ID -> dashboard Building info -> "Contact form ID"
- [ ] Brokerage name + TREC license number -> dashboard Building info (TX real-estate advertising)
- [ ] Confirm unit data: PH5 sqft, bed/bath counts, floor labels
- [ ] Full-resolution exterior rendering (current hero is a 1290px upscale)

Launch day (technical):
1. [ ] Delete the `X-Robots-Tag: noindex` line from public/_headers
2. [ ] Build + deploy; `curl -sI https://solarus.pages.dev/ | grep -i robots` must return nothing
3. [ ] Cloudflare Pages -> solarus -> Custom domains: add solarustower.com AND www.solarustower.com
4. [ ] In the Wix account: point the domain per Cloudflare's instructions (domain stays registered at Wix)
5. [ ] Verify https://www.solarustower.com loads, canonical + og tags show www.solarustower.com
6. [ ] Submit sitemap in Google Search Console; keep Wix subscription until indexing looks healthy, then cancel
7. [ ] GitHub backend for /admin (repo + update public/admin/config.yml backend.repo) so the dashboard edits production

Post-launch:
- [ ] Analytics (port Alta's host-gated deferred component when IDs exist)
- [ ] Self-host subset fonts (Alta pattern) to drop the Google Fonts request
- [ ] Consider per-unit Offer JSON-LD once real prices exist (Alta pattern)
