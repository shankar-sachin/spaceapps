/**
 * Build-time PSI cache (STUB).
 *
 * Investigation fields come from undocumented NASA PSI (Physical Sciences
 * Informatics) JSON endpoints. They must be fetched HERE, at build time, and
 * written to static JSON under public/data/. The browser never calls PSI live.
 *
 * DATA SLOT: PSI JSON endpoints -> public/data/psi-investigations.json
 *   Endpoint URLs are intentionally not listed: they are undocumented and must
 *   be confirmed by the team before use. Add them to PSI_ENDPOINTS below.
 *
 * Intended flow:
 *   1. fetch each endpoint in PSI_ENDPOINTS
 *   2. map raw records to the Investigation shape in src/data/placeholders.js
 *   3. write public/data/psi-investigations.json (+ a fetchedAt timestamp)
 *   4. src/data/placeholders.js (or a loader next to it) imports that file
 */

const PSI_ENDPOINTS = []; // DATA SLOT: confirmed PSI JSON endpoint URLs

if (PSI_ENDPOINTS.length === 0) {
  console.log('[cache-psi] No PSI endpoints configured yet. Nothing cached. See README "DATA SLOTS".');
  process.exit(0);
}
