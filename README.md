# Anhad Singh Sarna — Portfolio & Voxel World

A software engineering portfolio with a playable, Minecraft-inspired voxel landscape, a ground-level first-person 3D view, and an overhead map. The main portfolio is the landing page; a large illustrated **Play My World** card and hero button lead to the game at `/game/`.

## Run locally

From the repository root:

```bash
python3 -m http.server 8001 --bind 127.0.0.1
```

Open http://localhost:8001 for the portfolio or http://localhost:8001/game/ for the world. Stop the server with Ctrl+C. No packages, API keys, build steps, or game downloads are required.

## Play

- First-person view starts by default. Use two-finger trackpad scrolling to walk forward/backward and sideways; move the cursor across the world to look around without holding a click. Camera turns and movement ease smoothly; moving to the left or right edge continues the turn. Touchscreens still use drag-to-look. Click walkable ground to move there. Mouse capture is not required.
- WASD or arrow keys: move. Shift: run. Space: jump. On mobile, use the direction pad, drag to look, and tap Jump.
- Press F or use the view button to switch between first person and the overhead map.
- In the overhead map, click the ground to walk; use bridges or jump across the stream.
- Press E near a landmark, click its building, or use the bottom navigation to discover its story.
- Escape or the close button returns to the world.
- Collect eight crystals and discover five landmarks. Progress lasts for the current page session.
- Use the day/night button, zoom controls or mouse wheel, and home button to explore at your own pace.
- Touch controls and direct landmark navigation support mobile devices.

The cabin introduces the builder; the workshop presents projects; the watchtower explains the technical toolkit; the original portal provides contact links.

## Experience journey

Open `/game/?journey=experience`, use the **Experience Portal** button, or walk through the purple portal near spawn.

1. **Home base:** approach the mansion door and press E or click Enter. Inside the furnished home office, read the Space Copy remote internship chapter. Continue to the university.
2. **University of Alberta:** enter the academy to explore the teaching and study chapter. Continue to the campus runway.
3. **Edmonton → Toronto:** approach the aircraft and board with E, click Take flight, or use the journey navigation. A ten-second animated flight connects the two districts; a skip option and a shorter reduced-motion version are available.
4. **TD Terrace:** land in a separate downtown Toronto district, walk to the tower, and enter its lobby to read the TD internship chapter.

Each building has a distinct 3D interior, chapter-specific content, an outside exit, and a next-step button. The journey navigation lets visitors revisit completed stops. The skyline and flight are stylized game representations.


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
