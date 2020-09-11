import {
  LevelDesc,
  makePaddle,
  makeBall,
  makeLevelTarget,
  makeEdge,
  makeAccelerator,
} from "../level-objects";
import { vv2, ViewportUnits } from "../viewport";

export function level03(): LevelDesc {
  const paddle = makePaddle();
  const ball = makeBall(vv2(-30, -40), 0.5 as ViewportUnits, vv2(0, 1));
  const target = makeLevelTarget(vv2(30, -40));

  const edges = [
    // top
    makeEdge(vv2(50, 50), vv2(-50, 50)),
    // left
    makeEdge(vv2(-50, 50), vv2(-50, -50)),
    // bottom
    makeEdge(vv2(-50, -50), vv2(50, -50)),
    // right
    makeEdge(vv2(50, -50), vv2(50, 50)),
  ];

  return {
    ball,
    paddle,
    target,
    edges,
    das: [makeAccelerator(vv2(-20, 10), vv2(1, -1))],
  };
}
