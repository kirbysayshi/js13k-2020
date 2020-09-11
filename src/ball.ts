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
  collisionResponseAABB,
  sub,
  add,
  magnitude,
  collideCircleCircle,
  overlapCircleCircle,
  overlapAABBAABB,
  translate,
  scale,
  normalize,
} from "pocket-physics";
import {
  toPixelUnits,
  ViewportUnits,
  ViewportUnitVector2,
  ViewportCmp,
  toProjectedPixels,
  vv2,
} from "./viewport";
import { useCES } from "./components";
import { Paddle, getOffsetForPaddlePosition } from "./paddle";
import { maybeBounceOffEdge } from "./edge";
import {
  projectCposWithRadius,
  makePointEdgeProjectionResult,
  setVelocity,
} from "./phys-utils";
import { YellowRGBA, YellowRGBA05 } from "./theme";

export type Ball = {
  cpos: ViewportUnitVector2;
  ppos: ViewportUnitVector2;
  acel: ViewportUnitVector2;

  width: ViewportUnits;
  height: ViewportUnits;
};

export function drawBall(ball: Ball, interp: number) {
  const ces = useCES();
  const vp = ces.selectFirstData("viewport")!;
  const ctx = vp.dprCanvas.ctx;

  const { cpos, ppos, width, height } = ball;

  const halfWidth = (width / 2) as ViewportUnits;
  const halfHeight = (height / 2) as ViewportUnits;

  // Why does this look so bad without this???
  interp = 1;

  const x = toProjectedPixels(
    (ppos.x + interp * (cpos.x - ppos.x)) as ViewportUnits,
    "x"
  );
  const y = toProjectedPixels(
    (ppos.y + interp * (cpos.y - ppos.y)) as ViewportUnits,
    "y"
  );

  const pxWidth = toPixelUnits(width);
  const pxHeight = toPixelUnits(height);

  ctx.save();

  // TODO: consider a motion trail for the signal

  const trailDist = halfWidth / 8;
  const vel = sub(vv2(), cpos, ppos);
  const trails = magnitude(vel) / trailDist;
  const dir = normalize(vel, vel);

  ctx.fillStyle = YellowRGBA05;

  const trail = vv2();

  for (let i = 0; i < trails; i++) {
    scale(trail, dir, i * trailDist);

    ctx.fillRect(
      x - toPixelUnits(trail.x) - toPixelUnits(halfWidth),
      y - toPixelUnits(trail.y) - toPixelUnits(halfHeight),
      pxWidth,
      pxHeight
    );
  }

  ctx.fillStyle = YellowRGBA;
  ctx.fillRect(
    x - toPixelUnits(halfWidth),
    y - toPixelUnits(halfHeight),
    pxWidth,
    pxHeight
  );

  ctx.restore();
}

// let collidedPrevFrame = false;

export function moveAndMaybeBounceBall(
  ball: Ball,
  paddle: Paddle,
  vp: ViewportCmp,
  dt: number
) {
  accelerate(ball, dt);

  const { p0, p1, halfHeight } = getOffsetForPaddlePosition(paddle, vp);

  const edge = { e0: p0, e1: p1 };

  const int = ball;
  const radius = 2;

  const paddleRadius = halfHeight;

  // const intersectionPoint = vv2();
  // const projectedCpos = projectCposWithRadius(vv2(), int, radius);
  // const intersected = segmentIntersection(
  //   projectedCpos,
  //   int.ppos,
  //   edge.e0,
  //   edge.e1,
  //   intersectionPoint
  // );

  const projectedResult = makePointEdgeProjectionResult();
  projectPointEdge(int.cpos, edge.e0, edge.e1, projectedResult);

  const paddleCpos = copy(vv2(), projectedResult.projectedPoint);
  const paddleVelocity = sub(vv2(), paddle.int.cpos, paddle.int.ppos);
  const paddlePpos = sub(vv2(), paddleCpos, paddleVelocity);

  const totalRadius = radius + paddleRadius;

  if (
    projectedResult.u >= 0 &&
    projectedResult.u <= 1 &&
    projectedResult.distance <= totalRadius
    // &&
    // projectedResult.similarity > 0
  ) {
    // console.log('collision', projectedResult.distance, totalRadius)
    // console.log('ball v', sub(vv2(), ball.cpos, ball.ppos));
    // console.log('paddle v', paddleVelocity);

    const mass1 = 1;
    const mass2 = 10000000;
    const restitution1 = 0.5;
    const sfriction = 0.87;
    const dfriction = 0.87;

    const velOut1 = vv2();
    const velOut2 = vv2();

    collisionResponseAABB(
      int.cpos,
      int.ppos,
      mass1,
      restitution1,
      sfriction,
      dfriction,
      paddleCpos,
      paddlePpos,
      mass2,
      restitution1,
      sfriction,
      dfriction,
      projectedResult.edgeNormal,
      velOut1,
      velOut2
    );

    // only apply to paddle
    sub(int.ppos, int.cpos, velOut1);

    // console.log('ball v after, b4 inertia', sub(vv2(), ball.cpos, ball.ppos))

    // and move the ball away. invert depending on the side of the paddle that it hit.
    const resolveDist = Math.abs(totalRadius - projectedResult.distance);
    const resolve = scale(
      vv2(),
      projectedResult.edgeNormal,
      projectedResult.similarity > 0 ? resolveDist : -resolveDist
    );
    translate(resolve, int.cpos, int.ppos);
    // console.log('resolve', resolve);
  }

  inertia(ball);
}
