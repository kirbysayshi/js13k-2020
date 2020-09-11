# Level Design Notes / Help

## Player Goal

Bounce the signal (ball) to the target, while avoiding subspace disruptions, as quickly as possible (don't let it 404! silly theme...)

## Controls

- WASD: move the paddle
- ArrowLeft ArrowRight: rotate the paddle
- Left/Right Shift: Hold to BOOST your paddle movement

There will be some on-screen help eventually to show these.

There will be mobile touch controls that I'm hoping will be easier than keyboard... but suggestions for improvements are welcome.

## JS13K Deadline: Sunday at 7AM

Goal would be to have whatever level ideas you'd like to contribute on Saturday.

## Dev / Getting Started

```sh
yarn
yarn start
```

## To Add a Level

- make a new file in [src/levels](./src/levels) called whatever you want
- export a LevelDesc function (look at [level01](./src/levels/level01.ts#L10))
- import it and add it to the [levels array](./src/game-data.ts#L37)
- (optional): while debugging, put it first in the list so the game loads right into it to quicken iteration

## Level Design Notes

There are edges, one-way edges (pass through from behind, becomes solid after a single pass), directional accelerators (aka DK Barrel Cannons), the target, and the ball/signal. If you're looking for inspiration, think mini golf! Other ideas: having to "race" the signal before it gets blasted off course by an accelerator, or using accelerators to journey in open space between smaller contained courts. Could make huge huge levels, could make tiny bounce-a-thons more like rube-goldberg.

I may end up locking the controls and camera to track the signal once it hits a directional accelerator for a limited time (more like a cutscene). Haven't decided if that's necessary yet.

## Gotchas / Concepts / Misc

Units of measure: "world space" is in a unit called ViewportUnits. 100 == the width of the visible play area (aka the camera). The camera is 100x100 units. You can make the world as large as you want, of course. The three demo levels (so far) are sized to the size of the camera since they're introducing concepts to the player.

The camera starts at where ever the paddle is. Default is 0,0

Axis: 0,0 is the middle. +x is to the right. +y is up, like in math (aka the opposite of canvas).

Vectors: Try to use `vv2()` / `ViewportUnitVector2` as much as possible, since that gives some type checks for internal drawing code. `... as ViewportUnits` and `... as ViewportUnitVector2` are your friends.

Edges: Only one side of an edge is collidable. If you have an edge A -> B, A(0,0), B(10,0), then only the "top" of the edge (ball moving downwards into the edge) is collidable. The more technical description for A->B is that the edge normal points upwards.

"Markers": if the signal/ball or target are outside the camera, they get a tracking marker to tell you where it is, roughly.
