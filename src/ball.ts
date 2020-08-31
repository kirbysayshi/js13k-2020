import {
  inertia,
  accelerate,
  v2,
  PointEdgeProjection,
  projectPointEdge,
  segmentIntersection,
  rewindToCollisionPoint,
  collideCircleEdge,
  copy,
} from "pocket-physics";
import {

  toPixelUnits,
  ViewportUnits,
  ViewportUnitVector2,
  ViewportCmp,
  toProjectedPixels,
} from "./viewport";
import { useCES } from "./components";
import { Paddle, getOffsetForPaddlePosition } from "./paddle";

export type Ball = {
  cpos: ViewportUnitVector2;
  ppos: ViewportUnitVector2;
  acel: ViewportUnitVector2;

  width: ViewportUnits;
  height: ViewportUnits;
};

export function drawBall(ball: Ball, interp: number) {
  const ces = useCES();
  const vp = ces.selectFirstData('viewport')!;
  const ctx = vp.dprCanvas.ctx;

  const { cpos, ppos, width, height } = ball;

  const halfWidth = (width / 2) as ViewportUnits;
  const halfHeight = (height / 2) as ViewportUnits;

  const x = toProjectedPixels(
    (ppos.x + interp * (cpos.x - ppos.x)) as ViewportUnits, 'x'
  );
  const y = toProjectedPixels(
    (ppos.y + interp * (cpos.y - ppos.y)) as ViewportUnits, 'y'
  );

  const pxWidth = toPixelUnits(width);
  const pxHeight = toPixelUnits(height);

  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.fillRect(
    x - toPixelUnits(halfWidth),
    y - toPixelUnits(halfHeight),
    pxWidth,
    pxHeight
  );
  ctx.restore();
}

export function moveAndMaybeBounceBall(
  ball: Ball,
  paddle: Paddle,
  vp: ViewportCmp,
  dt: number
) {
  accelerate(ball, dt);

  const { p0, p1 } = getOffsetForPaddlePosition(paddle, vp);

  const endpoint1 = { cpos: p0, ppos: copy(v2(), p0), acel: v2() };
  const endpoint2 = { cpos: p1, ppos: copy(v2(), p1), acel: v2() };

  // TODO: use a circle instead? Otherwise there's no way to know the collision happened...

  // This sometimes misses the paddle, of course, due to tunneling. Also might be speeding the ball up???
  collideCircleEdge(ball, 2, 1, endpoint1, -1, endpoint2, -1, false, 1);

  // Instead:
  // segmentIntersection
  // if tunneling
  // projectPointEdge
  // translate ball to projected point
  // circleCircleCollision, delete temporary circle

  // But how to cause different ball angles? Perhaps paddle needs to be circular motion instead of octagon...

  // const projection: PointEdgeProjection = {
  //   distance: Number.MIN_SAFE_INTEGER,
  //   similarity: 0,
  //   u: Number.MIN_SAFE_INTEGER,
  //   projectedPoint: v2(),
  //   edgeNormal: v2(),
  // };

  // // p1(0,0) -> p2(1,0) produces a normal pointing down
  // projectPointEdge(ball.cpos, p0, p1, projection);

  // const intersectionPoint = v2();
  // const isTunneling = segmentIntersection(
  //   ball.cpos,
  //   ball.ppos,
  //   p0,
  //   p1,
  //   intersectionPoint
  // );

  // console.log(
  //   "tunneling?",
  //   isTunneling,
  //   "sim",
  //   projection.similarity,
  //   "within u",
  //   projection.u >= 0 && projection.u <= 1
  // );

  // const within = projection.u >= 0 && projection.u <= 1;

  // if (
  //   (projection.similarity >= 0 && within && projection.distance < 1) ||
  //   (within && isTunneling)
  // ) {
  //   // collision!
  //   console.log("collision!");
  // }

  inertia(ball);

  // if (rewound) {
    collideCircleEdge(ball, 1, 1, endpoint1, -1, endpoint2, -1, true, 1);
  // }
}
