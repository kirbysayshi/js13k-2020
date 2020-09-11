import { Paddle } from "./paddle";
import { ViewportUnits, vv2, ViewportUnitVector2 } from "./viewport";
import { Ball } from "./ball";
import { LevelTarget } from "./target";
import { useCES } from "./components";
import { translate } from "pocket-physics";
import {
  makePaddle,
  makeBall,
  makeLevelTarget,
  makeAccelerator,
  LevelDesc,
  makeOneWayEdge,
  makeEdge,
} from "./level-objects";

export function level01(): LevelDesc {
  return {
    ball: makeBall(vv2(), 0.1 as ViewportUnits, vv2(1, 1)),
    paddle: makePaddle(),
    target: makeLevelTarget(vv2(-10, -10)),
    edges: [
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
  };
}
