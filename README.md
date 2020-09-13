# js13k-2020

## Usage

Fork this repo, then add / change code in src/index.js as you see fit! There are dependencies included, but you can remove those. Rollup ensures that only code you `import` is included!

- Static files can be configured for copying in [rollup.config.js](./rollup.config.js). Default is just [`src/index.html`](src/index.html)
- Static files that are `import`ed are automatically copied into the `dist/` folder by rollup.
- PNG/ZIP optimizations are handled by scripts in the [tools](/tools) directory. PNGs are handled via tinypng.com, which requires an API key in a file named `.tinypngapi`.

### `yarn start`

Run type checking, rollup, and a local http server in watch mode.

### `yarn zip`

How close are you to the limit? Compiles in production mode, and creates a zip suitable for JS13K in `/dist`!

### `yarn deploy`

Build a zip, then deploy the `dist` folder to `gh-pages` seamlessly! Best for testing your game on multiple devices.

### `yarn http-server dist/`

Done automatically by `yarn start`, but perhaps you just ran `yarn zip` and want to run the actual compiled/mangled code.

### `yarn terser dist/bundle.js --compress --mangle --beautify`

This is a debug tool.

See what the compiled JS will look like, to make sure rollup is treeshaking / hoisting as expected and that dead code is being eliminated. `yarn build` will create a `dist/bundle.js` to use in this command.

## LICENSE

MIT

## Tasks

- [x] Paddle Moving
- [x] Ball Moving
- [x] Paddle + Ball Colliding == BOUNCE (might need to redesign paddle to be phys)
- [x] Paddle World Movement
- [x] Paddle World Movement Drag (too hard ot line up otherwise)
- [x] Ball -> Target colliding === WIN
- [x] Camera Movement
- [x] Convert paddle to new camera system
- [x] Ball -> Target Colliding === Win Once (/ reset)
- [x] Level 2
- [x] End Game state
- [x] Print out level name or number
- [x] Arrow / Marker to show which direction the ball/signal and target/destination is in
- [x] Arrow / Marker is just text label, maybe with a background rectangle color
- [x] Background grid or texture to better communicate movement
- [x] Ball + Environment Obstacle Colliding
- [x] End Game Screen with total time
- [x] BUG: accelerator drawing y is reversed with camera
- [x] Generate star field instead of grid
- [x] Directional Accelerator collider: hit it and get sent flying positively?
- [x] Allow pushing the signal and bouncing it with backside of paddle.
- [x] BUG: signal/target labels hide themselves on the bottom (too far down).
- [x] Should there be a velocity boost for the paddle movement?
- [x] Either a kill zone boundary sphere to keep ball in play, hard edges, or velocity boost for paddle to catch stray balls
- [x] clear canvas below the "safe" upper box
- [x] Prevent ball from accelerating when colliding...
- [x] Probably model collisions manually using segmentIntersection, projectPointEdge, collisionResponseAABB + valid normal
- [x] Signal: themed
- [x] BUG: directional accelerator does not reset velocity vector (direction)
- [x] Level Contract / Exports need to define ball/paddle/etc position not the paddle itself
- [x] Right Shift should also trigger boost to allow multiple hands
- [x] Draw projection of ball direction + velocity (ray)
- [x] One-way edge: pass through (dotted line) but bounces once on the other side
- [x] Demo level for Al/Phoebe to use as template
- [x] Send to Al & Phoebe with basic instructions
- [x] BUG: Mobile (maybe retina) doesn't render properly
- [x] Title Screen / Summary
- [x] Tutorial / Objective Screen
- [x] Color palette / THEME! Space Signals Radar Scopes : paddle, ball, target, markers, text
- [x] Target: themed
- [x] Paddle: themed
- [x] Touch Knob controls for mobile: use separate dom elements for each knob to avoid multitouch issues
- [x] Restart/Retry Level Button (keeps time, just resets positions)
- [x] Edges: themed
- [x] Background window: themed
- [x] Choose a Title
- [x] set index.html title
- [x] "Level x of ??" -> "Mission XX" (or flavor text)
- [x] Level / Tutorial Flavor text?
- [x] Move timer, level text, fps, etc to just below game field / camera
- [x] Hide mobile controls until in game
- [x] Mission Completed screen: themed
- [x] End Game Screen: themed
- [x] End Game screen has list of all times per level (+par?)
- [x] Font: themed
- [x] Tweet your total time
- [ ] Directional Accelerator trigger point legibility
- [ ] Level 01
- [ ] Level 02
- [ ] Level 03
- [ ] Level 04
- [ ] Level 05
- [ ] Level 06
- [ ] Level 07
- [ ] Level 08
- [ ] Level 09
- [ ] Level 10
- [ ] Paddle Crosshairs: themed
- [ ] Tutorial screen 1: just paddle rotation (disable movement), then a level or two
- [ ] Tutorial screen 2: just paddle movement (enable both), then the rest of levels
- [ ] Touch Rotation Controls: make an integratable so it's not 1:1 direct (momentum?)
- [ ] Target & Signal pointers should have distances
- [ ] BUG: signal can tunnel through paddle and get stuck in the middle...
- [ ] DESIGN: how to give minor signal corrections at speed???
- [ ] Directional Accelerator: Only trigger once until clear
- [ ] Directional Accelerator: camera follows signal with paddle in opposite direction of trajectory (or not drawn / not collidable) and input disabled (timed)
- [ ] Visual Feedback that the boost button is pressed
- [ ] Does the target need to be labeled?
- [ ] Should the paddle be smaller, given enclosed levels?
- [ ] IDEA: can use one-way edges as non-functional design element (ball moves passed)
- [ ] Ball velocity projection should bounce off paddle...
- [ ] Audio: hit effects
- [ ] Audio: some looping ambient chords
- [ ] Max Velocity for signal
- [ ] Paddle Boost should be a metered resource?
- [ ] CES .selectFirst creates the majority of allocations (iterators), and GC is a cause of noticeable pauses.
- [ ] Prevent ball tunneling when colliding with paddle (is this an issue? probably not if the paddle is large enough)
- [ ] Shorten radius of paddle?
- [ ] BUG: labels are hidden when transitioning from edge to corner
- [ ] "Play Again" button on end screen?
- [ ] Level / Goal Ideas: you have to get the signal to the destination in as few bounces as possible and as quickly as possible. When you reach the goal, you see a drawing of where the signal went and where you bounced it. You (camera) follow the signal as it bounces around?
- [ ] ~~A lose condition? Or just best time~~
- [ ] ~~Should the paddle be able to collide with edges? Or maybe just some edges?~~

## DevLog

## 2020-08-27

Nothing like starting almost at the end.

Idea: one knob controls a paddle rotating around a center point, a dpad controls the position of the paddle's center point. You have to bounce a ball (which leaves a trail) around obstacles in the world. You can only see 50 square ball area though, so it's about exploring too.

Get the signal to the people! Or... people are requesting something and you have to prevent a 404?

Got the paddle drawing, rotating around the screen in a manual way. Having the viewport already defined and using relative units from last time (js13k-2019) is nice. Spent way too much time forgetting that keyboard events will not fire on a DOM element without a tabindex set.

## 2020-08-28

Got a "ball" to move.

## 2020-08-29

Maybe found a bug in pocket-physics, like usual! Still such a mess. And then maybe didn't even need the specific method (`projectPointEdge`).

Got the ball bouncing off the paddle though.

## 2020-08-30

Paddle is moving via wasd, rotating via left/right. Bouncing has a tunneling issue.

There is a lot of GC happening in firefox. Not sure why, actually. Maybe I just needed to restart Firefox...

Spent forever figuring out a "camera". The player needs to be able to explore independent of the actual bounds of the canvas. Solution: invert the y axis in the canvas via `scale`, track a camera position value, and translate the canvas to the camera center. This means that 0, 0 when drawn is equivalent to 50, 50 in viewport units. It was also unclear if there could be just _one_ function that converted a viewport unit into pixels: it had to be two. One for position-less values (aka a width of a box) and another for camera-aware values (converting to absolute positions on the canvas). Adding to the confusion was the leftover screen shake system from js13k-2019. I removed it.

## 2020-08-31

Converted all rendering to use a basic camera projection! We're back at day 2 or so, but now the player can move around the world freely. Even got text working too.

## 2020-09-01

The game starts, plays level 1, then shows a WIN screen, then resets!

After deploying, discovered that Terser was mangling both the keyboard codes (ArrowLeft, w, etc) and unknown APIs like TextMetrics `actualBoundingBoxAscent`. Work around is to quote the props. Also tried contributing this back to Terser: https://github.com/terser/terser/pull/811.

## 2020-09-03

Upgraded Terser after my contribution was accepted!

There is now a level 2, even though it's barely different than level 1.

Added some refactored text drawing and a timer per level. Started on ball/target markers: have off-screen detection working!

## 2020-09-04

Not as much time to work today. But got the arrow markers at least positioned and writing text correctly. No shape yet. The majority of the time was actually spent reworking how text is drawn, moving it from being viewport-relative to world-relative.

There is a slight judder when rendering (especially the YOU WIN text) that I think is due to floating-point precision. I'm flooring the values before drawing, but they're bouncing between pixel boundaries even when static... if you don't floor, then the juddering stops. Keep it like that then!

## 2020-09-05

Drew a background grid so you can actually tell that the camera / paddle is moving, and not the target / signal. Eventually I'll make this a generated starfield or something.

There are level obstacles (Edges)! And the bouncing is looking great (and handles bullets), too! I'll need to use this same method for the paddle.

Took time to attempt to choose some colors, and make some mockups in Figma. I am so bad at design.

## 2020-09-06

Spent more time in Figma, but might just use a two color solution since I'm so bad at colors. And probably use simple shapes for the target and signal.

Text rendering is still fairly broken and inconsistent on canvas. Font are hard, for sure, but the bounding boxes are just off by 1 or two pixels too. I forgot that canvas font rendering at 0,0 is the baseline, not the top bounding box. So it's very hard to place text accurately.

Added the end game summary screen. Needs more polish, but it's there! All mission/levels have a total time.

## 2020-09-07

Directional accelerator is working! Tricky to draw and measure. Collision was relatively straightforward once I realized that all I needed was an entryway line segment as a detector.

## 2020-09-08

Started generating a starfield. Probably a better way to optimize so I'm not overdrawing as much... Also discovered a bug with how accelerators are drawn (maybe not taking camera into account?). oops!

Drawing a tiled background efficiently is slightly more conditional work than I anticipated.

## 2020-09-09

Fixed the accelrator rendering bug. Now clearing canvas beyond camera.

Keyboard events need to use `event.code`, which I didn't realize was different than `keyCode`: physical keyboard layout instead of key. Very nice!

Added a boost mode to movement, unmetered so far.

Spent a lot of time trying to prevent tunneling and changing paddle collisions to use aabb velocity solving. It's actually non-trivial to handle the paddle colliding with the ball (opposite velocity) vs the paddle pushing the ball (dampening velocity). One option is to treat the paddle as passthrough unless the ball is coming at it. Another is to use circle-circle collision... Stuck with "AABB" for now, since it allows for control over applying the velocity and has friction: but I'm modeling the detection and resolution as a circle-circle. It's too late.

Three nights remain.

## 2020-09-10

Really got a ton done today!

Added more theming (signal trails!), fixed bugs (edge collisions, accelerator). But mostly got what I deemed the minimum to be able to send it for level design collaboration. Got level code to be a bit better structured and hopefully more comprehensible.

Added one-way edges! They were thankfully very simple to implement.

## 2020-09-11

Fixed the terrifying bug where mobile devices appeared to be completely broken. Turned out it was an error in which `width` I was using to multiply the initial transform on viewport creation. I was using the native width instead of css pixel width.

Added a title and tutorial screens, along with some design choices. More polish is needed there, but it's better than nothing!

One night remains.

## 2020-09-12

The final day.

A few hours to get the touch controls in DOM and wired up. One problem with the game architecture right now is there's no specific place for persistent state. I could use CES, but the overhead of defining a component and using it is high (in terms of cognitive complexity: it really makes me overthink everythin).

Used some CSS Vars to sync font sizes and colors between the canvas world and CSS world. Probably overkill, as I'll likely have to make the font size independently larger for the UI anyway!
