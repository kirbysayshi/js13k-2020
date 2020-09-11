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
} from "./level-objects";

export function level02(): LevelDesc {

  const paddle = makePaddle();
  const ball = makeBall(vv2(), 0.1 as ViewportUnits, vv2(1, 1));
  const target = makeLevelTarget(vv2(-30, -10));

  return {
    ball,
    paddle,
    target,
    edges: [],
    das: [],
  };
}
