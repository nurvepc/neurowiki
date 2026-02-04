# Neurowiki SEO Strategy – Implementation Status

**Goal:** Rank in top 10 Google results for target medical/neurology keywords (e.g. NIHSS calculator, stroke protocol, neurology calculators).  
**Domain:** https://neurowiki.ai  
**Last updated:** 2026-02-03

---

## What’s Done in Code (Technical SEO)

- **robots.txt** – Allows all crawlers, no blocking; sitemap URL set to `https://neurowiki.ai/sitemap.xml`.
- **Canonical URLs** – Set per route via `Seo` component (pathname only, no query params).
- **Meta tags** – Dynamic per route: title, description, keywords, Open Graph, Twitter Card; staging gets `noindex,nofollow`.
- **Route meta** – Keyword-focused titles and 150–160 character descriptions for key pages (NIHSS, stroke-basics, calculators, guides, trials).
- **JSON-LD schema** – Organization on homepage; MedicalWebPage + SoftwareApplication for calculator pages; injected/updated on route change.
- **Sitemap** – `public/sitemap.xml` with clean URLs (e.g. `/calculators/nihss`), lastmod, changefreq, priority.
- **index.html** – Default meta, OG, Twitter, canonical, MedicalWebPage schema; `robots` index,follow.
- **Canonical URLs only in links** – All internal links to calculators use path-based URLs (e.g. `/calculators/nihss`, `/calculators/abcd2-score`) instead of `?id=...`. This avoids Google discovering duplicate `calculators?id=...` URLs and helps the “Discovered - currently not indexed” count improve as crawlers see one canonical URL per page. Legacy `?id=` visits still work via client-side redirect in `Calculators.tsx` to the canonical path.

---

## GSC “Why pages aren’t indexed” (and what we did)

If Search Console shows:

1. **Page with redirect (1)** – One URL redirects (e.g. a legacy `calculators?id=...` that the app redirects to the path-based URL). This is expected; we no longer link to `?id=` internally, so over time fewer such URLs will be discovered.
2. **Alternate page with proper canonical tag (1)** – One URL is correctly marked as alternate (canonical points to another URL). No change needed.
3. **Discovered - currently not indexed (50)** – Google knows these URLs but hasn’t indexed them yet. Normal for a newer site. Ensure the sitemap is submitted and request indexing for priority URLs (home, `/calculators/nihss`, `/guide/stroke-basics`, etc.). Internal links now point only to canonical paths so crawlers don’t waste discovery on `?id=` variants.

---

## Critical First Step (Manual – Do This First)

### 1. Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console).
2. **Add property:** `https://neurowiki.ai` (or `https://www.neurowiki.ai` if you use www).
3. **Verify ownership:** DNS TXT record (recommended with Cloudflare), or HTML file upload, or HTML meta tag.
4. **Submit sitemap:** Sitemaps → Add sitemap → `https://neurowiki.ai/sitemap.xml` → Submit.
5. **Request indexing:** URL Inspection → enter `https://neurowiki.ai/`, then Request Indexing. Repeat for:
   - `https://neurowiki.ai/calculators/nihss`
   - `https://neurowiki.ai/calculators`
   - `https://neurowiki.ai/guide/stroke-basics`
   - Other key URLs you care about.
6. **Check Coverage:** See how many URLs are indexed and fix any errors.

**Why you’re not ranking:** If the site isn’t in Search Console or the sitemap isn’t submitted, Google may not index you or may index slowly. Indexing usually starts within 2–7 days after submission.

### 2. Confirm Indexing

In Google search:

- `site:neurowiki.ai` – should eventually show your pages.
- `site:neurowiki.ai/calculators/nihss` – confirms the NIHSS page is indexed.

If you see 0 results, focus on Search Console (submit sitemap, request indexing, fix Coverage errors).

---

## Target Keywords (for content and meta)

| Keyword (examples)        | Intent        | Use in |
|--------------------------|---------------|--------|
| NIHSS calculator         | Tool / brand  | Title, description, H1, body |
| stroke calculator        | Tool          | Home, stroke-basics, calculators |
| acute stroke protocol    | Info          | stroke-basics, iv-tpa |
| neurology calculators    | Category      | Calculators page, meta |
| ASPECTS score            | Tool          | EVT pathway, future ASPECTS page |
| ABCD2 score, ICH score   | Tool          | Respective calculator pages |

Meta titles and descriptions in `src/seo/routeMeta.ts` are written with these in mind.

---

## Content and E-E-A-T (Manual / editorial)

- **Expand key pages to 1,500–2,500 words** (e.g. NIHSS, stroke-basics) with: intro, how to use, scoring guide, interpretation, evidence, FAQs, related tools. See the main SEO strategy doc for the NIHSS page structure.
- **Add E-E-A-T signals:** Medical review line (“Reviewed by Dr. X”), last updated date, citations (e.g. Brott et al., AHA/ASA guidelines). These can be added as a small “Medical review” block on calculator and guide pages.
- **Internal linking:** Use descriptive anchor text (“NIHSS calculator”, “stroke protocol”) instead of “click here”. Link between related calculators and protocols.

---

## Off-page and monitoring (manual)

- **Backlinks:** Outreach to residency programs, medical schools (.edu), CME pages, medical blogs. See main strategy doc for tiers and email template.
- **Tracking:** Search Console (impressions, clicks, position, Coverage); GA4 (traffic, behavior). Optional: Ahrefs/SEMrush for keywords and backlinks.

---

## Success Milestones (realistic)

- **1 month:** Site indexed (many URLs in Coverage), some impressions in Search Console.
- **3 months:** Rankings in positions 30–50 for some target terms; 10–20 quality backlinks; hundreds of organic visits.
- **6–12 months:** Top 20 for long-tail and some head terms; 50–100+ backlinks; thousands of organic visits.

---

## File Reference

| File / asset        | Purpose |
|---------------------|--------|
| `public/robots.txt` | Crawler access and sitemap URL |
| `public/sitemap.xml`| List of URLs for Search Console |
| `src/seo/routeMeta.ts` | Per-route title, description, keywords, image |
| `src/seo/schema.ts` | JSON-LD for Organization, MedicalWebPage, SoftwareApplication |
| `src/components/Seo.tsx` | Injects meta, canonical, and schema on route change |
| `index.html`         | Default meta and homepage schema |

---

## Quick checklist (Week 1)

- [ ] Add and verify property in Google Search Console for `https://neurowiki.ai`.
- [ ] Submit sitemap: `https://neurowiki.ai/sitemap.xml`.
- [ ] Request indexing for homepage and top 5–10 URLs.
- [ ] Confirm no `noindex` on production (only on staging).
- [ ] Check Coverage after a few days and fix any reported errors.
