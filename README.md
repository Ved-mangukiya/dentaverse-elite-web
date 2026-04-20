# Dentaverse Elite — Static Premium Site

This is a **100% static**, **zero-CDN** website designed to be hosted directly on **GitHub Pages**.
Users can open `index.html` locally and everything will work offline (no external fonts, libraries, or image CDNs).

## Pages
- `index.html`: Home
- `how-it-works.html`: Process
- `products.html`: Products + plans
- `about.html`: Who we are + mission/vision + roadmap
- `contact.html`: Contact form (offline-friendly)

## Design Goals
- **Premium ivory theme**: calm, clinical, high-end.
- **Mobile-first**: tuned for 320px–430px widths; touch targets \(≥44px\); bottom navigation on mobile.
- **3D feel**: subtle depth, shadows, blur glass, and tasteful motion.

## Offline Notes
- **No external fonts**: system font stack only.
- **No external images**: illustrations are local SVGs in `assets/`.
- **Contact form**: in this static demo, submissions are saved to `localStorage` (no server).

## Deploy to GitHub Pages
- Push the repository to GitHub.
- In GitHub: **Settings → Pages → Deploy from a branch**.
- Select your default branch and the `/ (root)` folder.

