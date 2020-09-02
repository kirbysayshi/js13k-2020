import { Paddle } from "./paddle";
import { ViewportUnits, vv2 } from "./viewport";
import { Ball } from "./ball";
import { LevelTarget } from "./target";
import { useCES } from "./components";


export function level1 () {
  const ces = useCES();
  const screen = ces.selectFirstData("viewport")!;

  const paddle: Paddle = {
    rads: 0,
    width: (screen.vpWidth / 8) as ViewportUnits,
    height: (screen.vpWidth / 16) as ViewportUnits,
    int: {
      acel: vv2(),
      cpos: vv2(),
      ppos: vv2(),
    },
  };

  const ball: Ball = {
    cpos: vv2(),
    ppos: vv2(),
    acel: vv2(),
    width: (screen.vpWidth / 16) as ViewportUnits,
    height: (screen.vpWidth / 16) as ViewportUnits,
  };

  const target: LevelTarget = {
    int: { cpos: vv2(-10, -10), ppos: vv2(-10, -10), acel: vv2() },
    dims: vv2(10, 10),
  };

  ball.acel.x = 0.1 as ViewportUnits;
  ball.acel.y = 0.1 as ViewportUnits;

  return {
    ball, paddle, target,
  }
}