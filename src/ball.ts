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
  ctx.fillStyle = "rgba(255,255,255,1)";
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

  const { p0, p1 } = getOffsetForPaddlePosition(paddle, vp);

  const edge = { e0: p0, e1: p1 };

  const int = ball;
  const radius = 2;

  const intersectionPoint = vv2();
  const projectedCpos = projectCposWithRadius(vv2(), int, radius);
  const intersected = segmentIntersection(
    projectedCpos,
    int.ppos,
    edge.e0,
    edge.e1,
    intersectionPoint
  );

  const projectedResult = makePointEdgeProjectionResult();
  projectPointEdge(int.ppos, edge.e0, edge.e1, projectedResult);

  // console.log(intersected, projectedResult.similarity)

  if (intersected) {
    const paddleCpos = intersectionPoint;
    const paddleVelocity = sub(vv2(), paddle.int.cpos, paddle.int.ppos);
    const paddlePpos = sub(vv2(), paddleCpos, paddleVelocity);

    if (projectedResult.similarity > 0) {
      rewindToCollisionPoint(
        int,
        radius,
        { cpos: edge.e0, ppos: edge.e0, acel: vv2() },
        { cpos: edge.e1, ppos: edge.e1, acel: vv2() }
      );
    }

    const mass1 = 1;
    const mass2 = 10000000;
    const restitution1 = 0.1;
    const sfriction = 0.9999;
    const dfriction = 0.9999;

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

    if (projectedResult.similarity > 0) {
      // console.log("sim > 0: velOut1", velOut1, velOut2);
      sub(int.ppos, int.cpos, velOut1);
      //add(int.ppos, int.ppos, velOut2);
    } else {
      
      // If the paddle is "pushing", then compound the velocity instead of subtracting it.

      const vel = sub(vv2(), int.cpos, int.ppos);
      // console.log("1 sim <= 0: velOut1", velOut1, velOut2);
      // console.log("2 sim <= 0: vel", vel);
      add(vel, vel, velOut1);
      sub(int.ppos, int.cpos, vel);
      // console.log("3 sim <= 0: next", sub(vv2(), int.cpos, int.ppos));
      
    //   add(int.ppos, int.cpos, velOut1);
    //   // add(int.ppos, int.ppos, velOut2);
    }

    // Apply velocity to integratable only, since edges have a huge mass and are effectively fixed

    // console.log('velOut1', velOut1, velOut2)
  }

  // Use same collision detection as edges?
  // maybeBounceOffEdge(ball, 2 as ViewportUnits, { e0: p0, e1: p1 });

  // const endpoint1 = { cpos: p0, ppos: copy(v2(), p0), acel: v2() };
  // const endpoint2 = { cpos: p1, ppos: copy(v2(), p1), acel: v2() };

  // TODO: use a circle instead? Otherwise there's no way to know the collision happened...

  // This sometimes misses the paddle, of course, due to tunneling. Also might be speeding the ball up???
  // collideCircleEdge(ball, 2, 1, endpoint1, -1, endpoint2, -1, false, 1);

  inertia(ball);
  // collideCircleEdge(ball, 1, 1, endpoint1, -1, endpoint2, -1, true, 1);
}
