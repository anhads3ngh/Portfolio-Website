# Anhad Singh Sarna — Portfolio & Voxel World

A software engineering portfolio with a playable, Minecraft-inspired voxel landscape, a ground-level first-person 3D view, and an overhead map. The main portfolio is the landing page; a large illustrated **Play My World** card and hero button lead to the game at `/game/`.

## Run locally

From the repository root:

```bash
python3 -m http.server 8001 --bind 127.0.0.1
```

Open http://localhost:8001 for the portfolio or http://localhost:8001/game/ for the world. Stop the server with Ctrl+C. No packages, API keys, build steps, or game downloads are required.

## Play

- Tap **Walk** once for hands-free forward movement, swipe the trackpad to steer, and tap **Stop walking** to stop. No holding or dragging is required.
- First-person view starts by default. Use two-finger trackpad scrolling to walk forward/backward and sideways; move the cursor across the world to look around without holding a click. Walking eases smoothly; camera rotation follows cursor input directly. The camera stops when cursor movement stops; screen edges never turn it automatically. Touchscreens still use drag-to-look. Click walkable ground to move there. Mouse capture is not required.
- WASD or arrow keys: move. Shift: run. Space: jump. On mobile, use the direction pad, drag to look, and tap Jump.
- Press F or use the view button to switch between first person and the overhead map.
- In the overhead map, click the ground to walk; use bridges to cross the stream. Water blocks walking, click-to-walk, and jumping, with a short swimming-skills message.
- Press E near a landmark, click its building, or use the bottom navigation to discover its story.
- Escape or the close button returns to the world.
- Collect eight crystals and discover five landmarks. Progress lasts for the current page session.
- Use the day/night button, zoom controls or mouse wheel, and home button to explore at your own pace.
- Touch controls and direct landmark navigation support mobile devices.

The cabin introduces the builder; the workshop presents projects; the watchtower explains the technical toolkit; the original portal provides contact links.

## Experience journey

Open `/game/?journey=experience`, use the **Experience Portal** button, or walk through the purple portal near spawn.

1. **Home base:** approach the mansion door and press E or click Enter. Inside the furnished bedroom-office, meet a photo-inspired voxel Anhad typing at a three-monitor workstation and read the Space Copy remote internship chapter. Continue to the university.
2. **University of Alberta:** enter a 60-seat computer lab to see Anhad teaching at the front and explore the teaching and study chapter. Continue to the campus runway.
3. **Edmonton → Toronto:** approach the aircraft and board with E, click Take flight, or use the journey navigation. A ten-second animated flight connects the two districts; a skip option and a shorter reduced-motion version are available.
4. **TD Terrace:** land at the Toronto airstrip, follow the glowing route downtown, enter TD Terrace’s concourse, and use the lift to visit floor 21. The office shows Anhad in business attire, typing and sipping coffee, alongside the TD internship chapter.

5. **Return to Edmonton:** take the lift to G, exit the concourse, follow the glowing trail to the Toronto airstrip, and board the return flight.

The lift has working G/21 controls, a live floor indicator, and an exit control. A Trail on/off button controls the navigation path; Hide story/Show story clears the view of each room. Main navigation is disabled during flights and lift rides; Reset remains available.

Each building has a distinct 3D interior, chapter-specific content, an outside exit, and a next-step button. Experience illustrations are displayed in unobstructed wall frames, with full-resolution image viewers in the chapter panels. The journey navigation lets visitors revisit completed stops. The skyline and flight are stylized game representations.


## Source

- `index.html`, `styles.css`, `script.js`: main portfolio.
- `game/`: procedural Canvas 2D overhead world, Three.js first-person world, player controls, and landmark dialogs.
- `game/landmark-buildings.js`: batched architectural geometry for the mansion, university, and TD tower.
- `game/experience-scenes.js`: photo-inspired voxel character, animated typing/coffee poses, bedroom workstation, instanced 60-student lab, TD concourse, floor-21 office, and lift cabin.
- `assets/td-terrace.jpg`, `assets/ualberta-campus.jpg`, `assets/spacecopy-remote.jpg`: AI-generated voxel interpretations for the experience section. The mansion is a fictional remote-work metaphor.
- `projects-data.js`: shared game project data. Only PulseOps and Cassandra Log Explorer link to project repositories; other projects show a title and description.
- `assets/voxel-world.svg`: original vector illustration for the play feature.
- `assets/Anhad_Singh_Sarna_Resume.pdf`: downloadable résumé.
- `classic/`: alternate access to the conventional portfolio layout.

Google Fonts are optional online resources; local system fonts provide the fallback. The game world is generated locally from code. First-person mode uses a locally vendored Three.js r170 renderer (MIT license in `game/vendor/THREE-LICENSE.txt`); it requires WebGL. The Canvas 2D overhead map remains available if 3D graphics are unavailable.

## Content scope

PulseOps is a simulated delivery reliability lab, not a live social integration. Cassandra Log Explorer uses synthetic logs rather than a live Cassandra cluster. Exploratory projects are described as experiments or concepts. Toolkit entries combine professional experience, coursework, and portfolio implementations.

## Deploy

Serve the repository as a static website. For GitHub Pages, select the `main` branch and repository root in Settings → Pages. All application and asset links support a repository subpath.

## Rendering

Terrain uses exposed surfaces instead of buried solid cubes. Geometry is grouped into spatial chunks with per-instance color, and inactive districts and interiors are hidden. Dynamic point-light loops are avoided; render resolution adapts downward on slow frames. The HUD updates only when values change, and room textures load on entry.

The avatar follows the supplied portrait’s navy turban, beard, and cream/navy striped top; business attire is used in the office. Rooms, the 60-seat classroom, and the airport route are game interpretations rather than photographic or floor-plan reproductions.

The house, University of Alberta, and TD Terrace are solid 3D voxel buildings with modeled fronts, sides, roofs and rear elevations. The mansion has green gables, a turret, a glazed study, balcony and gardens; the campus has brick wings and a clock tower; the TD interpretation has a glazed concourse, window mullions and an offset tower crown. Walk around them or approach their front doors to enter the connected interiors. Generated PNG illustrations remain in the indoor galleries. Exterior geometry shares the existing instance batches rather than loading large image panels.

## Final deployment and interaction polish

GitHub Pages serves the static repository from `main` at `/`, with `.nojekyll` preserving the static assets. The site URL is https://anhads3ngh.github.io/Portfolio-Website/ and the game is under `/game/`.

All portal and journey placements validate dry, unoccupied ground. Aircraft park on separate aprons, leaving both runways clear. Night mode illuminates ceiling fixtures, street lamps and ground pools using two reusable local lights. The lab includes six talkable student NPCs among its 60 seats; the office has six colleague NPCs. These are illustrative game characters.
