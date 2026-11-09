# Anhad Singh Sarna — Portfolio & Voxel World

A software engineering portfolio with a playable, Minecraft-inspired voxel landscape, first-person and third-person 3D views, and a separate overhead map. The main portfolio opens with a cinematic dark hero, a portrait-inspired voxel illustration, and **Play my story**. Three chapter cards launch the connected experience tour from home, university, or TD Terrace. The large **Enter my world** feature and header button open free exploration at `/game/`.

## Run locally

From the repository root:

```bash
python3 -m http.server 8001 --bind 127.0.0.1
```

Open http://localhost:8001 for the portfolio or http://localhost:8001/game/ for the world. Stop the server with Ctrl+C. No packages, API keys, build steps, or game downloads are required.

## Play

- Tap **Walk** once for hands-free forward movement, swipe the trackpad to steer, and tap **Stop walking** to stop. No holding or dragging is required.
- First-person view starts by default. Use two-finger trackpad scrolling to walk forward/backward and sideways; move the cursor across the world to look around without holding a click. Walking eases smoothly. Cursor look is bounded to a short arc per gesture and rebases after a pause or pointer warp; repeated movement cannot accumulate a full rotation. The camera stops when cursor movement stops; screen edges never turn it automatically. Touchscreens still use drag-to-look. Click walkable ground to move there. Mouse capture is not required.
- WASD or arrow keys: move. Shift: run. Space: jump. On mobile, use the direction pad, drag to look, and tap Jump.
- Press F or use the view button to switch between first person and a close third-person camera. Press M or World Map for the enlarged 2D map; the view button returns to 3D. Third person uses a smaller portrait-inspired character with animated legs and arms, a wider view of the world, and a camera that adjusts for nearby walls. The body faces the direction of travel instead of rotating with an idle cursor.
- In the overhead map, click the ground to walk; use bridges to cross the stream. Water blocks walking, click-to-walk, and jumping, with a short swimming-skills message.
- In 3D, the bottom navigation takes you to the cabin, workshop, tower or contact portal; press E or Enter to open its content. In the overhead map, click a building to open its story. The experience portal opens the chronological journey.
- Escape or the close button returns to the world.
- Collect eight crystals and discover five landmarks. Progress lasts for the current page session.
- Use the day/night button, zoom controls or mouse wheel, and home button to explore at your own pace.
- Touch controls and direct landmark navigation support mobile devices.

The cabin introduces the builder; the workshop presents projects; the watchtower explains the technical toolkit; the original portal provides contact links.

## Experience journey

Open `/game/?journey=experience`, use the **Experience Portal** button, or walk through the purple portal near spawn.

1. **Home base:** approach the mansion door and press E or click Enter. Inside the furnished bedroom-office, meet a photo-inspired voxel Anhad typing at a three-monitor workstation and read the Space Copy remote internship chapter. Continue to the university.
2. **University of Alberta:** enter a 60-seat computer lab to see Anhad teaching at the front and explore the teaching and study chapter. Continue to the campus runway.
3. **Edmonton → Toronto:** approach the aircraft and board with E, click Take flight, or use the journey navigation. The aircraft taxis onto a marked 1,020-unit runway, accelerates, rotates, climbs, flies past snowy mountain ridges and valleys, makes an aligned approach, flares, touches down, rolls out and taxis to a separate arrival apron. Airborne phase speeds join continuously; wheel and fan animations follow the flight and freeze when paused. A skip option and a shorter reduced-motion version are available.
4. **TD Terrace:** land at the Toronto airstrip, follow the glowing route downtown, enter TD Terrace’s concourse, and use the lift to visit floor 21. The office shows Anhad in business attire, typing and sipping coffee, alongside the TD internship chapter.

5. **Return to Edmonton:** take the lift to G, exit the concourse, follow the glowing trail to the Toronto airstrip, and board the return flight.

**Autoplay tour** walks the connected paths through all three chapters, reaches each physical exit doorway, continues outdoors to the next place, takes both flights, rides the lifts and returns to Edmonton. The story covers an introduction, work, and a takeaway at each stop. **Done** or closing the owner conversation continues through the room’s real exit; **Skip story · next chapter** follows the same connected route. Selecting another chapter keeps the guided journey running from that chapter onward. Flight skips and lift controls also continue the route. Pause/resume, stop, and replay remain available. Ordinary cursor movement does not steer or interrupt autoplay; deliberate dragging, scrolling, or movement keys pauses it. Choosing a question pauses for reading, and Done continues. A manual pause stays paused until resumed. Use `/game/?view=third&autoplay=1` for all three chapters, or add `&chapter=home`, `university`, or `td` to start at a particular chapter.

Approach Anhad in each room for a chapter-specific greeting. Press E or choose a question to hear what he worked on or what stayed with him. An optional Listen button uses the browser’s speech synthesis; narration is never played automatically.

The lift has working G/21 controls, a live floor indicator, and an exit control. A Trail on/off button controls the navigation path; Hide story/Show story clears the view of each room. Main navigation is disabled during flights and lift rides; Reset remains available.

Each building has a distinct 3D interior, chapter-specific content, an outside exit, and a next-step button. Experience illustrations are displayed in unobstructed wall frames, with full-resolution image viewers in the chapter panels. The journey navigation lets visitors revisit completed stops. The skyline, countryside and flight are stylized game representations. Flights use a damped camera on a fixed side of the route, a compact caption panel and place labels, keeping the landscape visible without orbiting around each aircraft turn. The snowy ridges are fictional scenery along the game route.


## Source

- `index.html`, `styles.css`, `script.js`: main portfolio with a dark cinematic hero, ivory/lavender typography, three experience launch cards, two featured project previews, a compact project archive, filters, responsive navigation, and email-copy controls.
- `assets/anhad-builder.svg`: original portrait-inspired voxel illustration.
- `assets/world-preview.jpg`: an actual gameplay capture used by the large play feature.
- `assets/favicon.svg`: portfolio tab icon.
- `game/`: procedural Canvas 2D overhead world, Three.js first-person world, player controls, and landmark dialogs.
- `game/flight-world.js`: chunked countryside, five snowy mountain peaks, forests, lakes, fields and settlements beneath the entire flight corridor.
- `game/flight-path.js`: continuous taxi, takeoff, flight and runway landing phases.
- `game/journey-routes.js`: shared paths, corridor joins and obstacle-aware connectors.
- `game/guided-tour.js`: connected three-chapter journey, conversation completion, chapter skipping, pause/resume and replay.
- `game/camera-controls.js`: bounded pointer gestures, pointer-warp rebasing and capped shortest-path camera turns.
- `game/night-lighting.js`: instanced emissive fixtures, warm halos and two pooled lights.
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

Terrain uses exposed surfaces instead of buried solid cubes. Geometry is grouped into spatial chunks with per-instance color, and inactive interiors are hidden. Outdoor districts stay available together, with spatial chunk culling and coarse distant scenery. Dynamic point-light loops are avoided; render resolution adapts downward on slow frames. The HUD updates only when values change, and room textures load on entry.

The avatar follows the supplied portrait’s navy turban, beard, and cream/navy striped top; business attire is used in the office. Rooms, the 60-seat classroom, and the airport route are game interpretations rather than photographic or floor-plan reproductions.

The house, University of Alberta, and TD Terrace are solid 3D voxel buildings with modeled fronts, sides, roofs and rear elevations. The mansion has green gables, a turret, a glazed study, balcony and gardens; the campus has brick wings and a clock tower; the TD interpretation has a glazed concourse, window mullions and an offset tower crown. Walk around them or approach their front doors to enter the connected interiors. Generated PNG illustrations remain in the indoor galleries. Exterior geometry shares the existing instance batches rather than loading large image panels.

## Final deployment and interaction polish

GitHub Pages serves the static repository from `main` at `/`, with `.nojekyll` preserving the static assets. The site URL is https://anhads3ngh.github.io/Portfolio-Website/ and the game is under `/game/`.

All portal and journey placements validate dry, unoccupied ground. Aircraft park on separate aprons, leaving both runways clear. Night mode lights the windows, ceiling fixtures, stone lanterns, street lamps and runway edges. Instanced warm halos and ground pools provide glow, with two reusable local lights selected using 3D distance. Workstation screens face the seated character; keyboards sit between the chair and monitors. The lab includes six talkable student NPCs among its 60 seats; the office has six colleague NPCs. These are illustrative game characters.

## Checks

Run `node --test game/tests/journey.test.mjs` to check runway alignment, airborne speed continuity, mountain clearance, obstacle-aware paths, bounded camera gestures, and the full tour with chapter completion, skips and interaction pauses. Browser checks cover screen normals, proximity stories, idle camera stability, trackpad movement, both complete flights, lifts, responsive controls and the full autoplay route.
