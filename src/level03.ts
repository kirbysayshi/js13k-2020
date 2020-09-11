import { ViewportUnits, vv2 } from "./viewport";
import {
  makePaddle,
  makeBall,
  makeLevelTarget,
  makeEdge,
  LevelDesc,
} from "./level-objects";

export function level03(): LevelDesc {
  const paddle = makePaddle();
  const ball = makeBall(vv2(), 0.5 as ViewportUnits, vv2(1, 1));
  const target = makeLevelTarget(vv2(-10, -10));

  // Add some obstacles

  const edges = [
    // vertical line, normal dir is important!
    makeEdge(vv2(30, -10), vv2(30, 40)),
    makeEdge(vv2(20, 50), vv2(-20, 50)),
  ];

  return {
    ball,
    paddle,
    target,
    edges,
    das: [],
  };
}
