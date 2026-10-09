# Maitreyee Tiwari, portfolio

Plain HTML, Tailwind CSS and JavaScript. No framework. The compiled CSS is already in `css/tailwind.css`, so the site works as is.

## Put it on GitHub Pages

1. Create a repo (for a site at `maitreyeetiwari5.github.io`, name it `maitreyeetiwari5.github.io`).
2. Upload everything in this folder except `node_modules`.
3. Repo **Settings > Pages**. Source: **Deploy from a branch**. Branch: `main`, folder `/ (root)`. Save.
4. Open the link GitHub shows after a minute or two.

## Things to update

| What | Where |
| --- | --- |
| Portrait | Add `assets/images/profile.jpg` (portrait, 4:5 works best). Without it, the page shows an "MT" tile. |
| Any project (text, numbers, GitHub link, status) | `js/projects.js`. Every project uses the same detail layout. |
| AI project: pass counts and "In progress" label | Its entry in `js/projects.js` (`status`, `glance`, "Where it stands"). |
| Ticker headlines | `window.TICKER` at the bottom of `js/projects.js` |
| Colours | Tokens at the top of `css/style.css` |
| Resume | Replace `assets/Maitreyee_Tiwari_Resume.pdf` (keep the file name). |

## If you change Tailwind classes

Run these once, then rebuild after edits to `index.html` or `js/*.js`:

```
npm install
npm run build
```

Commit the new `css/tailwind.css`.
