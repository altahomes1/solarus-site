// Server-side host guard. The zone rule handles www.solarusgalveston.com at the
// edge; this covers hostnames whose DNS we don't control (the old tower domain
// lives at Wix, so no zone rules are possible there). Any alias below gets a
// permanent, path-preserving redirect to the one true address.
const ALIASES = new Set([
  'www.solarusgalveston.com',
  'www.solarustower.com',
  'solarustower.com',
]);

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (ALIASES.has(url.hostname)) {
    url.hostname = 'solarusgalveston.com';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
