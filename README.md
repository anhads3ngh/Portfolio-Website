# Anhad Singh Sarna — Portfolio & Voxel World

A software engineering portfolio with a playable, Minecraft-inspired voxel landscape, a ground-level first-person 3D view, and an overhead map. The main portfolio is the landing page; a large illustrated **Play My World** card and hero button lead to the game at `/game/`.

## Run locally

From the repository root:

```bash
python3 -m http.server 8001 --bind 127.0.0.1
```

Open http://localhost:8001 for the portfolio or http://localhost:8001/game/ for the world. Stop the server with Ctrl+C. No packages, API keys, build steps, or game downloads are required.

## Play

- First-person view starts by default. Click the scene to capture the mouse; move the mouse to look. Escape releases it. Drag-to-look is also supported.
- WASD or arrow keys: move. Shift: run. Space: jump. On mobile, use the direction pad, drag to look, and tap Jump.
- Press F or use the view button to switch between first person and the overhead map.
- In the overhead map, click the ground to walk; use bridges or jump across the stream.
- Press E near a landmark, click its building, or use the bottom navigation to discover its story.
- Escape or the close button returns to the world.
- Collect eight crystals and discover five landmarks. Progress lasts for the current page session.
- Use the day/night button, zoom controls or mouse wheel, and home button to explore at your own pace.
- Touch controls and direct landmark navigation support mobile devices.

The cabin introduces the builder; the workshop presents projects; the academy covers professional and teaching experience; the watchtower explains the technical toolkit; the portal provides contact links.

## Source

- `index.html`, `styles.css`, `script.js`: main portfolio.
- `game/`: procedural Canvas 2D overhead world, Three.js first-person world, player controls, and landmark dialogs.
- `assets/td-terrace.jpg`, `assets/ualberta-campus.jpg`, `assets/spacecopy-remote.jpg`: AI-generated voxel interpretations for the experience section. The mansion is a fictional remote-work metaphor.
- `projects-data.js`: shared game project data. Only PulseOps and Cassandra Log Explorer link to project repositories; other projects show a title and description.
- `assets/voxel-world.svg`: original vector illustration for the play feature.
- `assets/Anhad_Singh_Sarna_Resume.pdf`: downloadable résumé.
- `classic/`: alternate access to the conventional portfolio layout.

Google Fonts are optional online resources; local system fonts provide the fallback. The game world is generated locally from code from code. First-person mode uses a locally vendored Three.js r170 renderer (MIT license in `game/vendor/THREE-LICENSE.txt`); it requires WebGL. The Canvas 2D overhead map remains available if 3D graphics are unavailable.

## Content scope

PulseOps is a simulated delivery reliability lab, not a live social integration. Cassandra Log Explorer uses synthetic logs rather than a live Cassandra cluster. Exploratory projects are described as experiments or concepts. Toolkit entries combine professional experience, coursework, and portfolio implementations.

## Deploy

Serve the repository as a static website. For GitHub Pages, select the `main` branch and repository root in Settings → Pages. All application and asset links support a repository subpath.
