# Paper Portfolio — Abhignyan Udgata

A newspaper-themed personal portfolio: 1890s broadsheet typography, a masthead loading screen, and a water-wipe page transition between pages.

**Live:** https://abhignyanudgata.dpdns.org/

## Stack

- Static multi-page HTML (no framework)
- [Vite 6](https://vitejs.dev/) for dev server and bundling
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- Vanilla JS (`src/main.js`) — loader, transitions, menu, scroll reveal
- Google Fonts: Bodoni Moda, Source Serif 4, Playfair Display

## Pages

| Route | File |
| --- | --- |
| `/` | `index.html` |
| `/work` | `work.html` |
| `/about` | `about.html` |
| `/legal` | `legal.html` |
| `/resume` | `public/resume.html` |
| 404 | `404.html` |

## Development

```bash
npm install
npm run dev      # dev server (default http://localhost:5173)
npm run build    # output to dist/
npm run preview  # serve the production build (default http://localhost:4173)
```

## Deployment

Hosted on **Cloudflare Pages** (project `landingpage-b8i`), connected to this repo.

Pages build settings:

- Framework preset: **None**
- Build command: *(empty)*
- Build output directory: `dist`

Because the build output is committed to the repo, run `npm run build` and commit `dist/` after any source change. Pushing to `main` deploys.

## Project structure

```
├── index.html, work.html, about.html, legal.html, 404.html
├── src/
│   ├── input.css        # Tailwind entry + @theme design tokens + component styles
│   └── main.js          # loader, page transitions, menu, reveal, zoom
├── public/              # copied as-is: resume.html, resume.pdf, og.png,
│                        # robots.txt, sitemap.xml, CNAME, .nojekyll
├── dist/                # committed build output (served by Cloudflare Pages)
├── design-tokens.json   # color/type token reference
└── vite.config.js       # multi-page inputs + asyncStyles() plugin
```

### Scripts and styles

`vite.config.js` includes an `asyncStyles()` plugin that rewrites the built stylesheet link into a `preload` → `onload` swap (with a `<noscript>` fallback) so first paint is not blocked. Google Fonts links in each page use the same pattern.

Each page carries a small inline critical-CSS block in `<head>` that paints the loader, page background, and transition cover before any stylesheet loads, preventing a flash of unstyled content on reload. Inline `<style>` is unlayered, so it takes precedence over Tailwind rules in `@layer components` regardless of specificity — keep that in mind when editing.

## Notes

- `dist/` is intentionally tracked. It is excluded via `.gitignore` only if you switch to a build-on-deploy setup.
- Cloudflare's Pretty URLs redirect `/work.html` to `/work` with a 308; internal links work either way.
- Colors: parchment `#e2dedb`, bone `#cdc6be`, ink `#1d1d1b`, charcoal `#4b4641`, accent `#c03f13`.

## Contact

- Email: abhignyanudgata11@gmail.com
- GitHub: https://github.com/AbhignyanUdgata
- LinkedIn: https://linkedin.com/in/abhignyan-udgata-108ba2289
