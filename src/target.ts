import { Integratable, overlapAABBAABB } from "pocket-physics";
import {
  ViewportUnitVector2,
  ViewportUnits,
  toPixelUnits,
  vv2,
  toProjectedPixels,
} from "./viewport";
import { Ball } from "./ball";
import { useCES } from "./components";

export type LevelTarget = {
  int: Integratable;
  dims: ViewportUnitVector2;
};

export function drawLevelTarget(target: LevelTarget, interp: number) {
  const vp = useCES().selectFirstData('viewport')!;
  const ctx = vp.dprCanvas.ctx;
  // Camera?
  const { x, y } = target.int.cpos as ViewportUnitVector2;
  const halfWidth = (target.dims.x / 2) as ViewportUnits;
  const halfHeight = (target.dims.y / 2) as ViewportUnits;

  ctx.save();
  ctx.fillStyle = "rgba(128,255,255,1)";
  ctx.translate(toProjectedPixels(x, 'x'), toProjectedPixels(y, 'y'));
  ctx.fillRect(
    0 - toPixelUnits(halfWidth),
    0 - toPixelUnits(halfHeight),
    toPixelUnits(target.dims.x),
    toPixelUnits(target.dims.y)
  );
  ctx.restore();
}

export function testWinCondition(target: LevelTarget, ball: Ball) {
  const result = overlapAABBAABB(
    target.int.cpos.x,
    target.int.cpos.y,
    target.dims.x,
    target.dims.y,
    ball.cpos.x,
    ball.cpos.y,
    ball.width,
    ball.height,
    {
      resolve: vv2(),
      hitPos: vv2(),
      normal: vv2(),
    }
  );

  if (result) {
    alert('you won!')
  }
}
