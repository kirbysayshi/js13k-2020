import { ViewportUnitVector2, ViewportUnits, vv2 } from "./viewport";
import { Paddle } from "./paddle";
import { Ball } from "./ball";
import { LevelTarget } from "./target";
import { Edge } from "./edge";
import { DirectionalAccelerator } from "./directional-accelerator";
import { useCES } from "./components";
import { copy, sub, scale } from "pocket-physics";

export type LevelDesc = {
  ball: Ball;
  paddle: Paddle;
  target: LevelTarget;
  edges: Edge[];
  das: DirectionalAccelerator[];
  flavorText: string;
};

export function makePaddle(start: ViewportUnitVector2 = vv2(0, 0)): Paddle {
  const ces = useCES();
  const screen = ces.selectFirstData("viewport")!;

  return {
    rads: 0,
    width: (screen.vpWidth / 2) as ViewportUnits,
    height: (screen.vpWidth / 16) as ViewportUnits,
    int: {
      acel: vv2(),
      cpos: copy(vv2(), start),
      ppos: copy(vv2(), start),
    },
  };
}

export function makeBall(
  start: ViewportUnitVector2 = vv2(),
  speed: ViewportUnits = 0 as ViewportUnits,
  direction: ViewportUnitVector2 = vv2()
): Ball {
  const ces = useCES();
  const screen = ces.selectFirstData("viewport")!;

  const ball = {
    cpos: copy(vv2(), start) as ViewportUnitVector2,
    ppos: copy(vv2(), start) as ViewportUnitVector2,
    acel: vv2(),
    width: (screen.vpWidth / 32) as ViewportUnits,
    height: (screen.vpWidth / 32) as ViewportUnits,
  };

  const vel = scale(vv2(), direction, speed);
  sub(ball.ppos, ball.cpos, vel);
  return ball;
}

export function makeLevelTarget(start: ViewportUnitVector2): LevelTarget {
  return {
    int: {
      cpos: copy(vv2(), start) as ViewportUnitVector2,
      ppos: copy(vv2(), start) as ViewportUnitVector2,
      acel: vv2(),
    },
    dims: vv2(10, 10),
  };
}

/**
 * Remember: endpoint0 -> endpoint1 means the bounce (normal) is ^ (up)!
 */
export function makeEdge(
  endpoint0: ViewportUnitVector2,
  endpoint1: ViewportUnitVector2
): Edge {
  return {
    e0: endpoint0,
    e1: endpoint1,
    oneWay: false,
    deactivatesTrackOther: false,
  };
}

export function makeOneWayEdge(
  endpoint0: ViewportUnitVector2,
  endpoint1: ViewportUnitVector2,
  deactivatesTrackOther: boolean = false
): Edge {
  return {
    e0: endpoint0,
    e1: endpoint1,
    oneWay: true,
    deactivatesTrackOther,
  };
}

export function makeAccelerator(
  start: ViewportUnitVector2,
  dir: ViewportUnitVector2,
  tracksBall: boolean = false
): DirectionalAccelerator {
  return {
    int: {
      cpos: copy(vv2(), start) as ViewportUnitVector2,
      ppos: copy(vv2(), start) as ViewportUnitVector2,
      acel: vv2(),
    },
    dims: vv2(10, 10),
    enter: copy(vv2(), dir) as ViewportUnitVector2,
    tracksBall,
  };
}
