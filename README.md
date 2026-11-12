# Anhad Singh Sarna — Portfolio & Voxel World

A software engineering portfolio with a playable, Minecraft-inspired voxel landscape, first-person and third-person 3D views, and a separate overhead map. The main portfolio uses a quiet, text-led layout with warm ivory and sage colours, plain-text names, and no logos or game imagery. Work, experience and contact information stay on the homepage; the interactive tour opens through a simple play link.

## Run locally

From the repository root:

```bash
python3 -m http.server 8001 --bind 127.0.0.1
```

Open http://localhost:8001 for the portfolio or http://localhost:8001/game/ for the world. Stop the server with Ctrl+C. No packages, API keys, build steps, or game downloads are required.

## Play

The game opens on an instruction screen before loading the 3D world. Choose **Autoplay my story** for the connected guided journey or **Explore on my own** for free movement. Third person is selected initially; the start screen also offers first person. Direct chapter URLs still show the instructions before starting. A lightweight map option can start without loading WebGL.

- Tap **Walk** once for hands-free forward movement, swipe the trackpad to steer, and tap **Stop walking** to stop. No holding or dragging is required.
- Choose first person on the instruction screen if you prefer an eye-level view. Use two-finger trackpad scrolling to walk forward/backward and sideways; move the cursor across the world to look around without holding a click. Walking eases smoothly. Cursor look is bounded to a short arc per gesture and rebases after a pause or pointer warp; repeated movement cannot accumulate a full rotation. The camera stops when cursor movement stops; screen edges never turn it automatically. Touchscreens still use drag-to-look. Click walkable ground to move there. Mouse capture is not required.
- WASD or arrow keys: move. Shift: run. Space: jump. On mobile, use the direction pad, drag to look, and tap Jump.
- In third person, swipe horizontally with two fingers to orbit a full 360°. Shift + a vertical swipe also orbits. Vertical scrolling walks; A/D strafe. Each wheel gesture locks its axis, and the camera stops turning as soon as the gesture stops. Ordinary hover still provides bounded cursor look.
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
2. **University of Alberta:** enter a 60-seat computer lab to see Anhad teaching at the front and explore the teaching and study chapter. Explore the main quad and campus departments, then follow the stone path to the airport car pickup.
3. **Campus → Edmonton Airport:** Anhad drives a full-size car along the amber access road to a terminal more than 3,000 world units from the university. Pause or skip the drive. Follow the blue passenger route through check-in and security to Gate A1.
4. **Edmonton → Toronto:** approach the aircraft and board with E, click Take flight, or use the journey navigation. The aircraft taxis onto a marked 1,020-unit runway, accelerates, rotates, climbs, flies past snowy mountain ridges and valleys, makes an aligned approach, flares, touches down, rolls out and taxis to a separate arrival apron. Airborne phase speeds join continuously; wheel and fan animations follow the flight and freeze when paused. A skip option and a shorter reduced-motion version are available.
5. **TD Terrace:** land on the separate Toronto arrival apron, walk through the glass terminal, and follow the blue passenger route downtown, enter TD Terrace’s concourse, and use the lift to visit floor 21. The office shows Anhad in business attire, typing and sipping coffee, alongside the TD internship chapter.

6. **Return to Edmonton:** take the lift to G, exit the concourse, walk through Toronto departures and board the return flight. Walk through Edmonton arrivals, ride back to campus in the car, and finish at the main quad. The ending offers **Exit to portfolio**, **Keep exploring**, **Replay**, and feedback.

**Autoplay tour** walks the connected paths through all three chapters, reaches each physical exit doorway, continues outdoors to the next place, takes both airport car transfers and flights, rides the lifts and returns to the campus quad. The story covers an introduction, work, and a takeaway at each stop. **Done** or closing the owner conversation continues through the room’s real exit; **Skip story · next chapter** follows the same connected route. Selecting another chapter keeps the guided journey running from that chapter onward. Drive skips, flight skips and lift controls also continue the route. Pause/resume, stop, and replay remain available. Ordinary cursor movement does not steer or interrupt autoplay; deliberate dragging, scrolling, or movement keys pauses it. Choosing a question pauses for reading, and Done continues. A manual pause stays paused until resumed. Use `/game/?view=third&autoplay=1` to preselect the full tour on the welcome screen, or add `&chapter=home`, `university`, or `td` to start at a particular chapter.

Approach Anhad in each room for a chapter-specific greeting. Press E or choose a question to hear what he worked on or what stayed with him. An optional Listen button uses the browser’s speech synthesis; narration is never played automatically.

The lift has working G/21 controls, a live floor indicator, and an exit control. A Trail on/off button controls the navigation path; Hide story/Show story clears the view of each room. Main navigation is disabled during drives, flights and lift rides; Reset remains available.

Each building has a distinct 3D interior, chapter-specific content, an outside exit, and a next-step button. Experience illustrations are displayed in unobstructed wall frames, with full-resolution image viewers in the chapter panels. The journey navigation lets visitors revisit completed stops. Toronto includes a compressed Front Street / King Street / York Street grid, crosswalks, sidewalks, street signs, Union Station’s colonnade, the CN Tower, a stepped Rogers Centre roof, rail tracks and a layered financial skyline. Cars and a red streetcar move along the roads. Passenger cars use a 168 × 66 × 62 unit body envelope against the explorer’s roughly 76-unit height; buses and streetcars are larger. All four sides of city towers have instanced lit window rows at night, with additional lighting on shops, the terminal, landmarks and distant houses. Edmonton has a northward river-valley district with Walterdale’s white twin arches, riverbank paths, city roads and a downtown skyline visible on climb-out. The bridge and downtown streets are also reachable on foot. Around the main university building are a main quad with a fountain and lawns, a library, engineering pavilion, student commons, residence, and Computing Science, Arts & Humanities, and Science departments. Nine houses with front gardens, driveways and parked cars form the nearby residential area. Campus streets and footpaths connect the precinct, and a bus follows the campus loop. More downtown traffic, riverbank cyclists, bus shelters and café seating bring activity to Edmonton. Thirty-five stationary outdoor NPCs greet nearby visitors with short captions and optional Talk interactions; greeting captions do not interrupt autoplay. The skyline, countryside and flight are stylized, compressed game representations. Flights use a damped camera on a fixed side of the route, a compact caption panel and place labels, looking further down at cruising altitude to keep the expanded terrain visible without orbiting around each aircraft turn. The snowy ridges are fictional scenery along the game route.


## Source

- `index.html`, `styles.css`, `script.js`: main portfolio with a dark cinematic hero, ivory/lavender typography, three experience launch cards, two featured project previews, a compact project archive, filters, responsive navigation, and email-copy controls.
- `assets/anhad-builder.svg`: original portrait-inspired voxel illustration.
- `assets/world-preview.jpg`: a capture of the rendered game world used by the welcome screen and portfolio play feature.
- `assets/favicon.svg`: portfolio tab icon.
- `game/`: procedural Canvas 2D overhead world, Three.js first-person world, player controls, and landmark dialogs.
- `game/flight-world.js`: chunked countryside, seven snowy mountain peaks, forests, lakes, fields and settlements beneath the entire flight corridor.
- `game/flight-path.js`: continuous taxi, takeoff, flight and runway landing phases.
- `game/airspace.js`: shared aircraft dimensions, airfield boundaries, traffic-route validation and component-level aircraft checks against rendered outdoor boxes. Decorative pedestrians and all traffic routes stay outside both airfields. Trees clear the approach corridors, signs stand outside the taxi areas, and runway-edge lights leave gaps at taxiway junctions. The airports have separate landside terminals and airside aprons. Passenger paths use gate openings and avoid the active strips.
- `game/world-layout.js`: shared airports, road-transfer routes, neighbourhood and path styles.
- `game/airport-scenes.js`: two walk-through terminals, gates, check-in areas, security arches, hangars, control towers and airport grounds.
- `game/airport-transfer.js`: the seated driver, rounded road path, car motion, pause and skip.
- `game/campus-neighbourhood.js`: main quad, fountain, residential houses and gardens.
- `game/game-flow.js`: instruction gate, exit/replay screen and feedback email drafts.
- `game/journey-routes.js`: shared paths, corridor joins and obstacle-aware connectors.
- `game/guided-tour.js`: connected three-chapter journey, conversation completion, chapter skipping, pause/resume and replay.
- `game/camera-controls.js`: bounded pointer gestures, explicit 360° trackpad orbit, gesture-axis locking, pointer-warp rebasing and capped shortest-path tour turns.
- `game/city-layout.js`, `game/city-scenery.js`, `game/city-life.js`: city layouts, batched landmark geometry, roads, moving traffic and stationary citizens with proximity greetings.
- `game/night-lighting.js`: instanced emissive fixtures, warm halos and two pooled lights.
- `game/landmark-buildings.js`: batched architectural geometry for the mansion, university, and TD tower.
- `game/experience-scenes.js`: photo-inspired voxel character, animated typing/coffee poses, bedroom workstation, instanced 60-student lab, TD concourse, floor-21 office, and lift cabin.
- `assets/td-terrace.jpg`, `assets/ualberta-campus.jpg`, `assets/spacecopy-remote.jpg`: AI-generated voxel interpretations used inside the game galleries. The mansion is a fictional remote-work metaphor.
- `projects-data.js`: shared game project data. Only PulseOps and Cassandra Log Explorer link to project repositories; other projects show a title and description.
- `assets/voxel-world.svg`: archived vector illustration; the homepage does not display game artwork.
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

Run `node --test game/tests/*.test.mjs` to check runway alignment, airborne speed continuity, mountain clearance, obstacle-aware paths, bounded pointer gestures, deliberate 360° trackpad orbit, city/citizen placement, complete traffic-route exclusion from airfields, passenger trails around runways, vehicle scale, rendered-obstacle detection, rounded car transfers, feedback draft encoding, the full tour with chapter completion, skips and interaction pauses, and night-light batching, cached selection and district changes. Browser checks cover screen normals, proximity stories, idle camera stability, trackpad movement, both complete flights and car transfers, terminal walks, lifts, responsive entry/exit screens, feedback fields and the full autoplay route.

City references: [Walterdale Bridge, City of Edmonton](https://www.edmonton.ca/projects_plans/walterdale-bridge), [downtown Toronto map](https://www.toronto.ca/311/assets/PDFs/map_metrohall.pdf), and [CN Tower location](https://www.cntower.ca/plan-your-visit/getting-here). Landmark relationships are compressed for the game; the airstrips and mountain corridor are fictional.

## Feedback

The ending and the **Exit** control include a required sender email and message. **Send feedback by email** opens a prefilled draft addressed to `assarna@ualberta.ca`; the visitor reviews and sends it in their email app. This is a static GitHub Pages site, so no background email delivery or server-side message storage is claimed.

Night lighting batches windows by spatial cell and reserves halos for actual lamps. Nearest-light selection is cached and uses a linear search. Camera vectors are reused, idle third-person obstruction checks are cached, and horizontal trackpad orbit uses a gentler sensitivity without automatic spin. Game assets use cache version 18.
