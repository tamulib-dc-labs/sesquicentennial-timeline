# Aggie Timeline

A standalone, interactive Texas A&M history timeline: decade tabs, event cards
with images/links, and full-text search. Extracted from the `aggie-theme`
component library into its own zero-framework app.

## Stack

- Vanilla JS + [Vite](https://vitejs.dev/)
- [FlexSearch](https://github.com/nextapps-de/flexsearch) for client-side search
- No framework, no backend — builds to static files

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview     # serve the production build locally
```

For GitHub Pages under a subpath, set the base at build time:

```bash
VITE_BASE=/aggie-timeline/ npm run build
```

## Editing content

All timeline content lives in [`public/timeline.json`](public/timeline.json).
Edit it directly — no code changes or rebuild of logic required.

```jsonc
{
  "title": "Texas A&M History Timeline",
  "subtitle": "Explore key moments in Aggie history",
  "decades": [
    {
      "label": "1870s",
      "year": "1870",
      "events": [
        {
          "date": "April 17, 1871",
          "title": "Texas A&M College Established",
          "description": "The Texas Legislature establishes the A&M College of Texas.",
          "image": "",       // optional
          "imageAlt": "",     // optional
          "link": ""          // optional
        }
      ]
    }
  ]
}
```

To re-pull content from the original `aggie-theme` repo:

```bash
node scripts/import-data.mjs ../aggie-theme/data/timeline-data.js
```

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | Page shell |
| `src/main.js` | Entry point — calls `renderTimeline` |
| `src/timeline.js` | Timeline component (render + search) |
| `src/timeline.css` | Self-contained styles + Aggie design tokens |
| `public/timeline.json` | Timeline content |
| `scripts/import-data.mjs` | Re-sync content from `aggie-theme` |
