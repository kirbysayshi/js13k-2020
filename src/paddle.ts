import { Vector2 } from "pocket-physics";
import { useCES } from "./components";
import {
  viewportSelector,
  ViewportUnits,
  toViewportUnits,
  toPixelUnits,
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

export function movePaddleRight(p: Paddle) {
  p.pos = ((p.pos + 1) % (MAX_PADDLE_STATE + 1)) as Paddle["pos"];
}

export function drawPaddle(p: Paddle) {
  const vp = useCES().selectFirstData(viewportSelector[0])!;
  const ctx = vp.dprCanvas.ctx;

  // TODO: add camera offset

  // use top square of viewport for paddle area
  const validAreaWidth = vp.vpWidth;
  const validAreaHeight = Math.min(vp.vpWidth, vp.vpHeight) as ViewportUnits;

  let transformAngle = 0;
  let transformX = 0 as ViewportUnits;
  let transformY = 0 as ViewportUnits;

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
    transformX = validAreaWidth - halfPaddleHeight as ViewportUnits;
    transformY = (validAreaHeight / 2) as ViewportUnits;
  } else if (p.pos === 3) {
    transformAngle = Math.PI * (3 / 4);
    transformX = (validAreaWidth - halfPaddleWidth) as ViewportUnits;
    transformY = (validAreaHeight - halfPaddleHeight) as ViewportUnits;
  } else if (p.pos === 4) {
    transformAngle = Math.PI;
    transformX = (validAreaWidth / 2) as ViewportUnits;
    transformY = validAreaHeight - halfPaddleHeight as ViewportUnits;
  } else if (p.pos === 5) {
    transformAngle = Math.PI * (5 / 4);
    transformX = 0 + halfPaddleWidth as ViewportUnits;
    transformY = (validAreaHeight - halfPaddleHeight) as ViewportUnits;
  } else if (p.pos === 6) {
    transformAngle = Math.PI * (3 / 2);
    transformX = 0 + halfPaddleHeight as ViewportUnits;
    transformY = (validAreaHeight / 2) as ViewportUnits;
  } else if (p.pos === 7) {
    transformAngle = Math.PI * (7 / 4);
    transformX = halfPaddleWidth + 0 as ViewportUnits;
    transformY = (0 + halfPaddleWidth) as ViewportUnits;
  } else {
    const _n: never = p.pos;
  }

  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.translate(toPixelUnits(transformX), toPixelUnits(transformY));
  ctx.rotate(transformAngle);
  ctx.fillRect(
    0 - toPixelUnits(halfPaddleWidth),
    0 - toPixelUnits(halfPaddleHeight),
    toPixelUnits(p.width),
    toPixelUnits(p.height)
  );
  ctx.restore();
}
