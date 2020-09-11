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
} from "./level-objects";
import { DirectionalAccelerator } from "./directional-accelerator";
import { Edge } from "./edge";



export function level01(): LevelDesc {
  const paddle = makePaddle();
  const ball: Ball = makeBall(vv2(), 0.1 as ViewportUnits, vv2(1, 1));

  const target = makeLevelTarget(vv2(-10, -10));

  const accelerator = makeAccelerator(vv2(10, 10), vv2(0, 1));

  // TODO: make a contract for how these should be returned? useEdges(), useDAs()?

  return {
    ball,
    paddle,
    target,
    edges: [],
    das: [accelerator],
  };
}
