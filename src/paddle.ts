import { Vector2, Integratable, scale, add } from "pocket-physics";
import { useCES } from "./components";
import {
  ViewportUnits,
  toViewportUnits,
  toPixelUnits,
  ViewportCmp,
  ViewportUnitVector2,
  vv2,
  toProjectedPixels,
} from "./viewport";
import { rotate2d } from "./phys-utils";
import { useDebugMode } from "./query-string";
import { BlackRGBA, YellowRGBA } from "./theme";

export type Paddle = {
  rads: number;
  width: ViewportUnits;
  height: ViewportUnits;

  int: Integratable;
};

export function rotatePaddleLeft(p: Paddle) {
  p.rads += 0.1;
}

export function rotatePaddleRight(p: Paddle) {
  p.rads -= 0.1;
}

export function movePaddle(p: Paddle, dir: ViewportUnitVector2) {
  add(p.int.acel, p.int.acel, dir);
}

export function getValidPaddleArea(vp: ViewportCmp) {
  const width = vp.vpWidth;
  const height = Math.min(
    vp.vpWidth * 0.75,
    vp.vpHeight * 0.75
  ) as ViewportUnits;
  return { width, height };
}

type Edge = { p0: ViewportUnitVector2; p1: ViewportUnitVector2 };

export function getOffsetForPaddlePosition(p: Paddle, vp: ViewportCmp) {
  // use top square of viewport for paddle area
  const { width: validAreaWidth, height: validAreaHeight } = getValidPaddleArea(
    vp
  );

  const halfPaddleWidth = (p.width / 2) as ViewportUnits;
  const halfPaddleHeight = (p.height / 2) as ViewportUnits;
  const center = vp.camera.target;

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

  return {
    x: xform.x,
    y: xform.y,
    angle: p.rads,
    halfWidth: halfPaddleWidth,
    halfHeight: halfPaddleHeight,
    // points of the paddle edge facing inwards
    p0,
    p1,
  };
}

export function drawPaddle(p: Paddle) {
  const vp = useCES().selectFirstData("viewport")!;
  const ctx = vp.dprCanvas.ctx;
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
  ctx.fillStyle = YellowRGBA;
  ctx.translate(toProjectedPixels(x, "x"), toProjectedPixels(y, "y"));
  ctx.rotate(Math.PI / 2 + angle);
  ctx.fillRect(
    0 - toPixelUnits(halfWidth),
    0 - toPixelUnits(halfHeight),
    toPixelUnits(p.width),
    toPixelUnits(p.height)
  );
  ctx.restore();

  if (process.env.NODE_ENV !== "production") {
    if (useDebugMode()) {
      drawEdge(ctx, { p0, p1 }, 1);
      drawIntegratable(ctx, p.int, 1);
    }
  }
}

function drawIntegratable(
  ctx: CanvasRenderingContext2D,
  cmp: Integratable,
  interp: number
) {
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.arc(
    toProjectedPixels(
      (cmp.ppos.x + (cmp.cpos.x - cmp.ppos.x) * interp) as ViewportUnits,
      "x"
    ),
    toProjectedPixels(
      (cmp.ppos.y + (cmp.cpos.y - cmp.ppos.y) * interp) as ViewportUnits,
      "y"
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
    toProjectedPixels(cmp.x, "x"),
    toProjectedPixels(cmp.y, "y"),
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
  ctx.strokeStyle = BlackRGBA;
  ctx.lineWidth = toPixelUnits(0.5 as ViewportUnits);
  ctx.moveTo(
    toProjectedPixels(edge.p0.x, "x"),
    toProjectedPixels(edge.p0.y, "y")
  );
  ctx.lineTo(
    toProjectedPixels(edge.p1.x, "x"),
    toProjectedPixels(edge.p1.y, "y")
  );
  ctx.stroke();
  ctx.restore();
}
