import { Vector2, Integratable } from "pocket-physics";
import { useCES } from "./components";
import {
  viewportSelector,
  ViewportUnits,
  toViewportUnits,
  toPixelUnits,
  ViewportCmp,
  ViewportUnitVector2,
  vv2,
} from "./viewport";

export type Paddle = {
  // top, topright, right, rightbottom, bottom, bottomleft, left, lefttop
  pos: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  width: ViewportUnits;
  height: ViewportUnits;
};

const MAX_PADDLE_STATE = 7;

export function movePaddleLeft(p: Paddle) {
  let next = (p.pos - 1) as Paddle["pos"];
  if (next < 0) next = MAX_PADDLE_STATE;
  p.pos = next;
}

export function getValidPaddleArea(vp: ViewportCmp) {
  const width = vp.vpWidth;
  const height = Math.min(vp.vpWidth, vp.vpHeight) as ViewportUnits;
  return { width, height };
}

export function movePaddleRight(p: Paddle) {
  p.pos = ((p.pos + 1) % (MAX_PADDLE_STATE + 1)) as Paddle["pos"];
}

type Edge = { p0: ViewportUnitVector2; p1: ViewportUnitVector2 };

// Taken nearly verbatim from gl-matrix
function rotate2d<V extends Vector2>(
  out: V,
  target: V,
  origin: V,
  rad: number
) {
  //Translate point to the origin
  let p0 = target.x - origin.x,
    p1 = target.y - origin.y,
    sinC = Math.sin(rad),
    cosC = Math.cos(rad);

  //perform rotation and translate to correct position
  out.x = p0 * cosC - p1 * sinC + origin.x;
  out.y = p0 * sinC + p1 * cosC + origin.y;

  return out;
}

// TODO: account for camera / world
export function getOffsetForPaddlePosition(p: Paddle, vp: ViewportCmp) {
  // use top square of viewport for paddle area
  const { width: validAreaWidth, height: validAreaHeight } = getValidPaddleArea(
    vp
  );

  let transformAngle = 0;
  let transformX = 0 as ViewportUnits;
  let transformY = 0 as ViewportUnits;
  let p0 = vv2();
  let p1 = vv2();

  const halfPaddleWidth = (p.width / 2) as ViewportUnits;
  const halfPaddleHeight = (p.height / 2) as ViewportUnits;

  if (p.pos === 0) {
    transformAngle = 0;
    transformX = (validAreaWidth / 2) as ViewportUnits;
    transformY = halfPaddleHeight as ViewportUnits;
  } else if (p.pos === 1) {
    transformAngle = Math.PI / 4;
    transformX = (validAreaWidth - halfPaddleWidth) as ViewportUnits;
    transformY = (0 + halfPaddleWidth) as ViewportUnits;
  } else if (p.pos === 2) {
    transformAngle = Math.PI / 2;
    transformX = (validAreaWidth - halfPaddleHeight) as ViewportUnits;
    transformY = (validAreaHeight / 2) as ViewportUnits;
  } else if (p.pos === 3) {
    transformAngle = Math.PI * (3 / 4);
    transformX = (validAreaWidth - halfPaddleWidth) as ViewportUnits;
    transformY = (validAreaHeight - halfPaddleHeight) as ViewportUnits;
  } else if (p.pos === 4) {
    transformAngle = Math.PI;
    transformX = (validAreaWidth / 2) as ViewportUnits;
    transformY = (validAreaHeight - halfPaddleHeight) as ViewportUnits;
  } else if (p.pos === 5) {
    transformAngle = Math.PI * (5 / 4);
    transformX = (0 + halfPaddleWidth) as ViewportUnits;
    transformY = (validAreaHeight - halfPaddleHeight) as ViewportUnits;
  } else if (p.pos === 6) {
    transformAngle = Math.PI * (3 / 2);
    transformX = (0 + halfPaddleHeight) as ViewportUnits;
    transformY = (validAreaHeight / 2) as ViewportUnits;
  } else if (p.pos === 7) {
    transformAngle = Math.PI * (7 / 4);
    transformX = (halfPaddleWidth + 0) as ViewportUnits;
    transformY = (0 + halfPaddleWidth) as ViewportUnits;
  } else {
    const _n: never = p.pos;
  }

  p0.x = (transformX - halfPaddleWidth) as ViewportUnits;
  p0.y = transformY;
  p1.x = (transformX + halfPaddleWidth) as ViewportUnits;
  p1.y = transformY;

  rotate2d(p0, p0, vv2(transformX, transformY), (Math.PI * 2) + transformAngle);
  rotate2d(p1, p1, vv2(transformX, transformY), (Math.PI * 2) + transformAngle);

  return {
    x: transformX,
    y: transformY,
    // REMEMBER: this is ctx.transform angle (screen: radians + clockwise), not counterclockwise trig!
    angle: transformAngle,
    halfWidth: halfPaddleWidth,
    halfHeight: halfPaddleHeight,
    // points of the paddle edge facing inwards
    p0,
    p1,
  };
}

export function drawPaddle(p: Paddle) {
  const vp = useCES().selectFirstData(viewportSelector[0])!;
  const ctx = vp.dprCanvas.ctx;

  // TODO: add camera offset

  const { x, y, angle, halfHeight, halfWidth, p0, p1 } = getOffsetForPaddlePosition(
    p,
    vp
  );

  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.translate(toPixelUnits(x), toPixelUnits(y));
  ctx.rotate(angle);
  ctx.fillRect(
    0 - toPixelUnits(halfWidth),
    0 - toPixelUnits(halfHeight),
    toPixelUnits(p.width),
    toPixelUnits(p.height)
  );
  ctx.restore();

  drawEdge(ctx, { p0, p1 }, 1)
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
