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

export function level040(): LevelDesc {
  const paddle = makePaddle(Math.PI, vv2(30, 0));
  const ball = makeBall(vv2(30, 0), 0.5 as ViewportUnits, vv2(0, 1));
  const target = makeLevelTarget(vv2(135, 0));

  const edges = makeEdgesFromPoints([
    vv2(-25, 25),
    vv2(25, 25),

    vv2(25, 20),

    vv2(55, 30),
    vv2(60, 10),
    vv2(65, 30),
    vv2(70, 9),
    vv2(75, 30),
    vv2(80, 8),
    vv2(85, 30),
    vv2(90, 7),
    vv2(95, 30),
    vv2(100, 6),
    vv2(105, 30),
    vv2(110, 5),
    vv2(115, 30),
    vv2(120, 4),
    vv2(125, 30),

    vv2(145, 25),
    vv2(145, -25),
    vv2(125, -25),

    vv2(120, -4),
    vv2(115, -30),
    vv2(110, -5),
    vv2(105, -30),
    vv2(100, -6),
    vv2(95, -30),
    vv2(90, -7),
    vv2(85, -30),
    vv2(80, -8),
    vv2(75, -30),
    vv2(70, -9),
    vv2(65, -30),
    vv2(60, -10),
    vv2(55, -30),

    vv2(50, -20),

    vv2(25, -25),
    vv2(-25, -25),
  ]);

  return {
    ball,
    paddle,
    target,
    edges,
    das: [],
    flavorText: "No death spikes here",
  };
}
