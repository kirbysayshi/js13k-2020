import {
  LevelDesc,
  makePaddle,
  makeBall,
  makeLevelTarget,
  makeEdge,
  makeAccelerator,
  makeEdgesFromPoints,
} from "../level-objects";
import { vv2, ViewportUnits } from "../viewport";

export function level032(): LevelDesc {
  const paddle = makePaddle();
  const ball = makeBall(vv2(-21, 20), 0.5 as ViewportUnits, vv2(1, 0));
  const target = makeLevelTarget(vv2(0, 0));

  const edges = makeEdgesFromPoints([
    vv2(-50, 50),
    vv2(50, 50),
    vv2(50, -50),
    vv2(-50, -50),
  ]);

  return {
    ball,
    paddle,
    target,
    edges,
    das: [
      makeAccelerator(vv2(-20, 20), vv2(1, 0)),
      makeAccelerator(vv2(20, 20), vv2(0, -1)),
      makeAccelerator(vv2(20, -20), vv2(-1, 0)),
      makeAccelerator(vv2(-20, -20), vv2(0, 1)),
    ],
    flavorText: "Tetherball",
  };
}
