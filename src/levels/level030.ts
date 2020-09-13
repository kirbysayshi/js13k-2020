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

export function level030(): LevelDesc {
  const paddle = makePaddle();
  const ball = makeBall(vv2(-30, -40), 0.5 as ViewportUnits, vv2(0, 1));
  const target = makeLevelTarget(vv2(30, -40));

  const edges = makeEdgesFromPoints([
    vv2(-60, 60),
    vv2(60, 60),
    vv2(60, -60),
    vv2(-60, -60),
  ]);

  return {
    ball,
    paddle,
    target,
    edges,
    das: [makeAccelerator(vv2(-20, 10), vv2(1, -1))],
    flavorText: "Arrows, they shoot",
  };
}
