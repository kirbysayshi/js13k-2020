js13k-2020
===========

Usage
-----

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

LICENSE
-------

MIT

Tasks
-----

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
- [ ] Arrow / Marker to show which direction the ball/signal and target/destination is in
- [ ] Background grid or texture to better communicate movement
- [ ] Ball + Environment Obstacle Colliding
- [ ] Color palette: paddle, ball, target, markers, text
- [ ] Shorten radius of paddle?
- [ ] Prevent ball from accelerating when colliding...
- [ ] Prevent ball tunneling when colliding
- [ ] clear canvas below the "safe" upper box
- [ ] Touch Knob controls for mobile
- [ ] "Play Again" button on end screen?
- [ ] A lose condition? Or just best time
- [ ] Level / Goal Ideas: you have to get the signal to the destination in as few bounces as possible and as quickly as possible. When you reach the goal, you see a drawing of where the signal went and where you bounced it.
- [ ] End Game Screen with total times

DevLog
------

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