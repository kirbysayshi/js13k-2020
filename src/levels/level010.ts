import {
  LevelDesc,
  makeBall,
  makePaddle,
  makeLevelTarget,
  makeEdge,
  makeEdgesFromPoints,
} from "../level-objects";
import { vv2, ViewportUnits } from "../viewport";

export function level010(): LevelDesc {
  return {
    ball: makeBall(vv2(20, 0), 0.5 as ViewportUnits, vv2(-1, 0)),
    paddle: makePaddle(Math.PI),
    target: makeLevelTarget(vv2(40, 0)),
    edges: makeEdgesFromPoints([
      vv2(-60, 60),
      vv2(60, 60),
      vv2(60, -60),
      vv2(-60, -60),
    ]),
    das: [],
    flavorText: "Signal, meet target",
  };
}
