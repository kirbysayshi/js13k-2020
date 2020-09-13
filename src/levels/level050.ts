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

export function level050(): LevelDesc {
  const paddle = makePaddle(Math.PI, vv2(0, 0));
  const ball = makeBall(vv2(-30, 0), 5 as ViewportUnits, vv2(1, 0));

  const dist = 5000;
  const target = makeLevelTarget(vv2(dist, -10));

  const acceleratorDist = 20;
  const acceleratorCount = dist / acceleratorDist;

  const edges = makeEdgesFromPoints([
    vv2(-60, 60),
    vv2(5010, 60),
    vv2(5010, -110),
    vv2(-60, -110),
  ]);

  return {
    ball,
    paddle,
    target,
    edges,
    das: [
      ...Array.from(new Array(acceleratorCount)).map((_, i) =>
        makeAccelerator(vv2(i * acceleratorDist, -10), vv2(1, 0), true, false)
      ),
    ],
    flavorText: "Chase! Shift or btn to boost!",
  };
}
