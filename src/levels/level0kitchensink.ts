import { ViewportUnits, vv2 } from "../viewport";
import {
  makePaddle,
  makeBall,
  makeLevelTarget,
  makeEdge,
  LevelDesc,
  makeAccelerator,
  makeOneWayEdge,
} from "../level-objects";

// level to introduce moving
// level to introduce arrows better
// level to introduce arrows that track
// level to introduce one-way edges

export function levelKitchenSink(): LevelDesc {
  const paddle = makePaddle();
  const ball = makeBall(vv2(0, 0), 0.1 as ViewportUnits, vv2(1, 0));
  const target = makeLevelTarget(vv2(30, -40));

  const edges = [makeOneWayEdge(vv2(400, 50), vv2(400, -50), true)];

  return {
    ball,
    paddle,
    target,
    edges,
    das: [makeAccelerator(vv2(10, 0), vv2(1, 0), true)],
    flavorText: "It's basically everything",
  };
}
