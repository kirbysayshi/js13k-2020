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

export function level031(): LevelDesc {
  const paddle = makePaddle(Math.PI);
  const ball = makeBall(vv2(-30, -40), 0.5 as ViewportUnits, vv2(0, 1));
  const target = makeLevelTarget(vv2(510, 0));

  const edges = makeEdgesFromPoints([
    vv2(-50, 50),
    vv2(50, 50),
    vv2(50, 5),

    vv2(500, 10),
    vv2(500, 20),
    vv2(520, 20),
    vv2(520, -20),
    vv2(500, -20),
    vv2(500, -10),

    vv2(50, -5),
    vv2(50, -50),
    vv2(-50, -50),
  ]);

  return {
    ball,
    paddle,
    target,
    edges,
    das: [makeAccelerator(vv2(50, 0), vv2(1, 0), true)],
    flavorText: "Some arrows take you with",
  };
}
