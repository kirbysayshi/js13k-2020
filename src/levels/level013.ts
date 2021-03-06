import {
  LevelDesc,
  makeBall,
  makePaddle,
  makeLevelTarget,
  makeEdge,
  makeEdgesFromPoints,
} from "../level-objects";
import { vv2, ViewportUnits, ViewportUnitVector2 } from "../viewport";

export function level013(): LevelDesc {
  return {
    ball: makeBall(vv2(20, 0), 0.2 as ViewportUnits, vv2(-1, 0)),
    paddle: makePaddle(Math.PI),
    target: makeLevelTarget(vv2(80, -180)),
    edges: makeEdgesFromPoints([
      vv2(-60, 60),
      vv2(100, 60),
      vv2(100, -200),
      vv2(60, -200),
      vv2(60, -60),
      vv2(-60, -60),
    ]),
    das: [],
    flavorText: "Down the well...",
  };
}
