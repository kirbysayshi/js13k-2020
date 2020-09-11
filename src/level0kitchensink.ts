
import { ViewportUnits, vv2 } from "./viewport";
import {
  makePaddle,
  makeBall,
  makeLevelTarget,
  makeEdge,
  LevelDesc,
  makeAccelerator,
} from "./level-objects";

export function levelKitchenSink(): LevelDesc {
  const paddle = makePaddle();
  const ball = makeBall(vv2(40, 40), 0.5 as ViewportUnits, vv2(-1, 0.5));
  const target = makeLevelTarget(vv2(30, -40));

  const edges = [
    // top
    makeEdge(vv2(50, 50), vv2(-50, 50)),
    // // left
    // makeEdge(vv2(-50, 50), vv2(-50, -50)),
    // // bottom
    // makeEdge(vv2(-50, -50), vv2(50, -50)),
    // // right
    // makeEdge(vv2(50, -50), vv2(50, 50)),
  ];

  return {
    ball,
    paddle,
    target,
    edges,
    das: [
      // makeAccelerator(vv2(-20, 10), vv2(1, -1))
    ],
  };
}
