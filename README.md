# Anhad Singh Sarna — Portfolio

An interactive Mars outpost portfolio for software engineering, DevOps, AI and systems projects. Drive a rover between five research stations to discover the portfolio. The original editorial site is preserved at `classic/`.

## Explore the outpost

- Drive with WASD, arrow keys, click-to-move, or the on-screen mobile controls.
- Press E near a station, click its building, or use the destination navigation to open it.
- Visit all five stations to complete the discovery tracker for the current session.
- Press Escape or the close button to return to the world.
- Use the reset button to return the rover to the landing pad.

## Run locally

### Quickest way
Open `index.html` in a web browser. The page works without a build step.

### Recommended local development server

From the `anhad-portfolio` folder:

```bash
python3 -m http.server 8000
```

Then visit **http://localhost:8000**.

Stop with `Ctrl+C`.

## Deploy to GitHub Pages

1. Create a new repository (for example, `portfolio`).
2. Upload **the contents of this folder** to the repository root.
3. In **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. After GitHub Pages finishes publishing, open the provided URL.

You can also use Netlify or Vercel as a static site with no build command.

## Customize

- `index.html`: Game interface and accessible destination navigation.
- `script.js`: Canvas world, rover controls, station content, and project filtering.
- `projects-data.js`: Project descriptions, categories, and technologies. Only the two pinned repositories (PulseOps and Cassandra Log Explorer) have project links.
- `styles.css`: Interface, station dialogs, and responsive layouts.
- `classic/`: Original portfolio layout.
- `assets/Anhad_Singh_Sarna_Resume.pdf`: Downloadable résumé.

## Important content checks before publishing

- Verify your LinkedIn and GitHub accounts and every listed project.
- **PulseOps** is a local demo with AWS infrastructure configuration, not a verified live cloud deployment.
- Emotion-Based Music Recommender and Intelligent Study Companion are presented as exploratory work; edit or remove if not completed.
- The résumé included here is the DevOps-targeted version from this conversation; replace it if you want a general-purpose résumé.
- Google Fonts are requested online. The site falls back gracefully to installed system fonts when offline.

## Stack

Plain HTML, CSS, JavaScript — no framework, dependencies, tracking code, or build tools.

## Accessibility

Semantic sections, keyboard-operable navigation, descriptive button labels, visible hover feedback, responsive layouts, and reduced-motion support.
