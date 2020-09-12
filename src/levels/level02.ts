import {
  LevelDesc,
  makeBall,
  makePaddle,
  makeLevelTarget,
  makeEdge,
  makeOneWayEdge,
} from "../level-objects";
import { vv2, ViewportUnits } from "../viewport";

export function level02(): LevelDesc {
  return {
    ball: makeBall(vv2(0, -10), 0.5 as ViewportUnits, vv2(0, 1)),
    paddle: makePaddle(),
    target: makeLevelTarget(vv2(30, 10)),
    edges: [
      makeEdge(vv2(20, 15), vv2(-20, 15)), // normal is downwards
      makeOneWayEdge(vv2(-20, 5), vv2(20, 5)),

      // top
      makeEdge(vv2(50, 50), vv2(-50, 50)),
      // left
      makeEdge(vv2(-50, 50), vv2(-50, -50)),
      // bottom
      makeEdge(vv2(-50, -50), vv2(50, -50)),
      // right
      makeEdge(vv2(50, -50), vv2(50, 50)),
    ],
    das: [],
    flavorText: "One way is the only way",
  };
}
