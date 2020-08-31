import { Vector2, Integratable, scale, add } from "pocket-physics";
import { useCES } from "./components";
import {
  ViewportUnits,
  toViewportUnits,
  toPixelUnits,
  ViewportCmp,
  ViewportUnitVector2,
  vv2,
} from "./viewport";
import { rotate2d } from "./phys-utils";

export type Paddle = {
  // top, topright, right, rightbottom, bottom, bottomleft, left, lefttop
  // pos: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  rads: number;
  width: ViewportUnits;
  height: ViewportUnits;

  int: Integratable;
};

// const MAX_PADDLE_STATE = 7;

export function rotatePaddleLeft(p: Paddle) {
  // normally + rads == counterclockwise rotation, but we're in direct screen mode so use -
  p.rads -= 0.2;
}

export function rotatePaddleRight(p: Paddle) {
  p.rads += 0.2;
}

export function movePaddle(p: Paddle, dir: ViewportUnitVector2) {
  add(p.int.acel, p.int.acel, dir);
}

export function getValidPaddleArea(vp: ViewportCmp) {
  const width = vp.vpWidth;
  const height = Math.min(vp.vpWidth, vp.vpHeight) as ViewportUnits;
  return { width, height };
}

type Edge = { p0: ViewportUnitVector2; p1: ViewportUnitVector2 };

// TODO: account for camera / world
export function getOffsetForPaddlePosition(p: Paddle, vp: ViewportCmp) {
  // use top square of viewport for paddle area
  const { width: validAreaWidth, height: validAreaHeight } = getValidPaddleArea(
    vp
  );

  // TODO: center is offset from screen, +y is down...
  const halfPaddleWidth = (p.width / 2) as ViewportUnits;
  const halfPaddleHeight = (p.height / 2) as ViewportUnits;
  // const center = vv2(validAreaWidth / 2, validAreaHeight / 2);
  const center = p.int.cpos;

  // All of these are in math coords: +y is up, rotation is counterclockwise
  const dir = vv2(Math.cos(p.rads), Math.sin(p.rads));
  const offset = scale(
    vv2(),
    dir,
    Math.min(validAreaWidth / 2, validAreaHeight / 2)
  );
  const xform = add(vv2(), center, offset) as ViewportUnitVector2;
  const p0 = vv2(xform.x, xform.y - halfPaddleWidth);
  const p1 = vv2(xform.x, xform.y + halfPaddleWidth);
  rotate2d(p0, p0, xform, p.rads);
  rotate2d(p1, p1, xform, p.rads);

  // TODO: +y in physics is up. in drawing, it's down. Be more explicit about a phys/Math computation vs drawing.
  // TODO: screen coordinates vs physics coords.

  return {
    //
    x: xform.x,
    y: xform.y,
    // math angle
    angle: p.rads,
    halfWidth: halfPaddleWidth,
    halfHeight: halfPaddleHeight,
    // points of the paddle edge facing inwards
    p0,
    p1,
  };
}

export function drawPaddle(p: Paddle) {
  const vp = useCES().selectFirstData('viewport')!;
  const ctx = vp.dprCanvas.ctx;

  // TODO: add camera offset

  const {
    x,
    y,
    angle,
    halfHeight,
    halfWidth,
    p0,
    p1,
  } = getOffsetForPaddlePosition(p, vp);

  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.translate(toPixelUnits(x), toPixelUnits(y));
  ctx.rotate(Math.PI / 2 + angle);
  ctx.fillRect(
    0 - toPixelUnits(halfWidth),
    0 - toPixelUnits(halfHeight),
    toPixelUnits(p.width),
    toPixelUnits(p.height)
  );
  ctx.restore();

  drawEdge(ctx, { p0, p1 }, 1);
  drawIntegratable(ctx, p.int, 1);
}

function drawIntegratable(
  ctx: CanvasRenderingContext2D,
  cmp: Integratable,
  interp: number
) {
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.arc(
    toPixelUnits(
      (cmp.ppos.x + (cmp.cpos.x - cmp.ppos.x) * interp) as ViewportUnits
    ),
    toPixelUnits(
      (cmp.ppos.y + (cmp.cpos.y - cmp.ppos.y) * interp) as ViewportUnits
    ),
    toPixelUnits(1 as ViewportUnits),
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function drawPoint(
  ctx: CanvasRenderingContext2D,
  cmp: ViewportUnitVector2,
  interp: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.arc(
    toPixelUnits(cmp.x),
    toPixelUnits(cmp.y),
    toPixelUnits(1 as ViewportUnits),
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.restore();
}

function drawEdge(ctx: CanvasRenderingContext2D, edge: Edge, interp: number) {
  drawPoint(ctx, edge.p0, interp);
  drawPoint(ctx, edge.p1, interp);

  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = toPixelUnits(0.5 as ViewportUnits);
  ctx.moveTo(toPixelUnits(edge.p0.x), toPixelUnits(edge.p0.y));
  ctx.lineTo(toPixelUnits(edge.p1.x), toPixelUnits(edge.p1.y));
  ctx.stroke();
  ctx.restore();
}
