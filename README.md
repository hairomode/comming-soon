# AI Powerup · Coming soon

A multilingual, static product teaser based on the platform stories supplied in `docs/`. This is an independent marketing site, not the learner application or a live course-generation service.

**Production domain:** `https://h.ai.romode.me`

**Repository:** `cyrill62/hairomode-comingsoon`

## Stack

- Vike + React + TypeScript, prerendered HTML (no production server)
- Tailwind CSS 4 + daisyUI 5 with a custom forest / lime theme
- Motion for restrained, reduced-motion-aware interactions
- i18next + react-i18next + ICU, nested JSON dictionaries
- Bun with exact dependency versions and committed `bun.lock`

## Develop

```sh
bun install --frozen-lockfile
bun run fonts
bun run dev
```

Open `http://localhost:3000/en/`. Use `bun x`, not `bunx`, if the latter alias is unavailable.

## Build and verify

```sh
bun run check
VITE_SITE_URL=https://h.ai.romode.me bun run build
PORT=4173 bun run scripts/serve-static.ts
```

In another terminal:

```sh
bun x playwright install chromium
TEST_URL=http://localhost:4173 bun run test:e2e
```

If the default Playwright browser cache is not writable, prefix both install and test commands with `PLAYWRIGHT_BROWSERS_PATH=/a/writable/cache`.

The deployment artifact is **`dist/client/`**, not `dist/server/`. The latter exists only as build-time rendering infrastructure. The static artifact includes the root, 11 locale homepages, a 404 document, `CNAME`, `.nojekyll`, robots.txt, and (when `VITE_SITE_URL` is set) the localized sitemap.

`BASE_PATH` defaults to `/`, appropriate for the custom domain. For project-path hosting, set `BASE_PATH=/repository-name/` and `VITE_SITE_URL=https://owner.github.io/repository-name` together. The Pages workflow intentionally uses `/` and the supplied custom domain.

## Localization

The languages in `docs/stories/E14-i18n.md` are supported:

`en`, `en-IN`, `fr`, `de`, `es`, `it`, `zh` (Simplified), `ar`, `hi`, `bn`, `ta`.

- Marketing copy lives in `locales/<lang>/corporate.json` as nested JSON, suitable for future Tolgee import.
- Only the namespace used by this teaser is implemented; application, billing and email namespaces belong to the platform, not this site.
- `en-IN` is intentionally `{}` and falls back to `en`; add only India-specific differences.
- Dictionary imports run on the build/server side. Each prerendered page sends only its current dictionary and English fallback, not all languages.
- Only `/` performs browser-language detection; explicit locale URLs are respected. A language selection persists when localStorage is available and preserves the section anchor.
- Locale switches load the corresponding prerendered URL. `<html lang>` and `dir` are correct before JavaScript runs.
- Arabic uses RTL, logical properties and mirrored directional arrows. Indic / Arabic line heights are more generous.
- Latin fonts are self-hosted via Fontsource; Noto Sans SC / Arabic / Devanagari / Bengali / Tamil are prepared from the locked Fontsource packages, with a script-specific stylesheet loaded only on its matching locale.
- `bun run check:locales` rejects missing/extra/empty keys, dotted keys and mismatched ICU placeholder names (with the intentional `en-IN` subset exception).
- Translations are complete draft marketing copy; native-speaker editorial review is recommended before a major campaign.

## GitHub Pages

`.github/workflows/pages.yml` validates types, unit tests and translation parity, builds every locale, exercises the actual static output with Playwright, then deploys through the official Pages artifact/actions workflow. Pull requests validate but do not deploy. Main pushes and manual runs deploy. The repository's Pages source must be **GitHub Actions**.

### Custom domain DNS

At the DNS provider for `romode.me`, create:

| Type | Name | Target |
| --- | --- | --- |
| CNAME | `h.ai` | `cyrill62.github.io` |

Some providers require the full record name `h.ai.romode.me`. Use DNS-only mode initially if your provider offers an HTTP proxy. Configure `h.ai.romode.me` as the repository's Pages custom domain. Once GitHub provisions its certificate, enable **Enforce HTTPS**. A CNAME record takes a hostname, not a URL or repository path.

`public/CNAME` preserves the domain in the deployed artifact, while canonical links, hreflang alternates, Open Graph metadata and the sitemap use the production URL from CI.

## Scope and editorial decisions

- Product story: describe a work challenge → find or generate a relevant course → learn step by step and give feedback.
- Team learning is described as a planned direction, not an available feature.
- The course card is labeled a **concept preview**; it is not an interactive or currently available course.
- No fabricated customer numbers, testimonials, launch date, prices, signup form or fake waitlist.
- No tracking scripts, cookies, remote font services or collection of personal data. LocalStorage stores only the chosen locale.
- Raw platform `docs/` are intentionally ignored by Git and are not part of this public repository.

## Test coverage

Unit tests cover supported locales, URL matching, project-base links, browser detection and RTL. Browser tests cover every locale's server-rendered language/direction and metadata, locale font stylesheet selection, FAQ behavior, overflow at 360 / 768 / 1440 px, language switching, mobile navigation, reduced motion, visible CTA text and WCAG 2.1 AA automated scans in English and Arabic. Automated scans do not replace manual accessibility and native-language review.
