import { Paddle } from "./paddle";
import { ViewportUnits, vv2 } from "./viewport";
import { Ball } from "./ball";
import { LevelTarget } from "./target";
import { useCES } from "./components";
import { translate } from "pocket-physics";
import {
  makePaddle,
  makeBall,
  makeLevelTarget,
  LevelDesc,
  makeOneWayEdge,
  makeAccelerator,
  makeEdge,
} from "./level-objects";

export function level02(): LevelDesc {
  return {
    ball: makeBall(vv2(0, -10), 0.5 as ViewportUnits, vv2(0, 1)),
    paddle: makePaddle(),
    target: makeLevelTarget(vv2(30, 10)),
    edges: [
      makeEdge(vv2(20, 15), vv2(-20, 15)), // normal is downwards
      makeOneWayEdge(vv2(-20, 5), vv2(20, 5))
    ],
    das: [],
  };
}
