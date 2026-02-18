/**
 * Cloudflare Pages Function — NPI Registry CORS Proxy
 * Route: /api/npi
 *
 * The NPPES NPI Registry API does not send CORS headers, so browser
 * fetch calls fail. This function proxies requests server-side and
 * adds the appropriate CORS headers for the NeuroWiki frontend.
 *
 * Query params are forwarded as-is to the NPPES API.
 * Example: /api/npi?version=2.1&first_name=john&last_name=doe&limit=10&enumeration_type=NPI-1
 */

const NPPES_BASE = 'https://npiregistry.cms.hhs.gov/api/';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const upstreamUrl = new URL(NPPES_BASE);

  // Forward all query params to NPPES
  url.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.set(key, value);
  });

  try {
    const response = await fetch(upstreamUrl.toString(), {
      headers: { 'User-Agent': 'NeuroWiki/1.0' },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `NPPES responded with ${response.status}` }), {
        status: response.status,
        headers: CORS_HEADERS,
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'NPI lookup failed', detail: String(err) }), {
      status: 502,
      headers: CORS_HEADERS,
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
