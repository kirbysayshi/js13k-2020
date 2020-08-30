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
- [ ] Prevent ball tunneling when colliding
- [ ] Ball -> Target colliding === LEVEL WIN
- [ ] Ball + Environment Obstacle Colliding
- [ ] Camera / World Movement


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

