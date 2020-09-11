import {
  ViewportUnitVector2,
  toProjectedPixels,
  toPixelUnits,
  ViewportUnits,
  IntegratableVU,
  vv2,
} from "./viewport";
import { useCES } from "./components";
import {
  segmentIntersection,
  rewindToCollisionPoint,
  collisionResponseAABB,
  normal,
  sub,
  projectPointEdge,
  dot,
} from "pocket-physics";
import { Ball } from "./ball";
import {
  projectCposWithRadius,
  makePointEdgeProjectionResult,
} from "./phys-utils";
import { YellowRGBA } from "./theme";

export type Edge = {
  e0: ViewportUnitVector2;
  e1: ViewportUnitVector2;
  oneWay: boolean;
};

export function drawEdges(edges: Edge[]) {
  const {
    dprCanvas: { ctx },
  } = useCES().selectFirstData("viewport")!;

  ctx.save();

  ctx.strokeStyle = YellowRGBA;
  ctx.lineWidth = toPixelUnits(1 as ViewportUnits);

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    if (edge.oneWay)
      ctx.setLineDash([
        toPixelUnits(1 as ViewportUnits),
        toPixelUnits(2 as ViewportUnits),
      ]);
    else ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(
      toProjectedPixels(edge.e0.x, "x"),
      toProjectedPixels(edge.e0.y, "y")
    );
    ctx.lineTo(
      toProjectedPixels(edge.e1.x, "x"),
      toProjectedPixels(edge.e1.y, "y")
    );
    ctx.closePath();
    ctx.stroke();
  }

  ctx.restore();
}

export function processEdges(edges: Edge[], ball: Ball) {
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    maybePassThroughOneWay(ball, (ball.width / 2) as ViewportUnits, edge);
    maybeBounceOffEdge(ball, (ball.width / 2) as ViewportUnits, edge);
  }
}

function maybePassThroughOneWay(
  int: IntegratableVU,
  radius: ViewportUnits,
  edge: Edge
) {
  if (!edge.oneWay) return;

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

  if (intersected && projectedResult.similarity < 0) {
    // ppos was behind edge, cpos is in front: crossed!
    // Turn it into a normal Edge!
    edge.oneWay = false;
  }
}

function maybeBounceOffEdge(
  int: IntegratableVU,
  radius: ViewportUnits,
  edge: Edge
) {
  if (edge.oneWay) return;

  const intersectionPoint = vv2();
  const projectedCpos = projectCposWithRadius(vv2(), int, radius);
  const intersected = segmentIntersection(
    projectedCpos,
    int.ppos,
    edge.e0,
    edge.e1,
    intersectionPoint
  );

  // If the object is extremely fast and has already bounced, on the next frame
  // the previous position, aka the velocity, will be on the other side of the
  // line. Ensure that we only handle a collision if the ppos is on the edge
  // normal side of the line. This also forces all lines to only have one active
  // bounce direction.
  const projectedResult = makePointEdgeProjectionResult();
  projectPointEdge(int.ppos, edge.e0, edge.e1, projectedResult);

  if (intersected && projectedResult.similarity > 0) {
    // TODO: This can only be used once per update step, because there isn't a
    // way of knowing right now if the rewinding collision was due to an actual
    // collision or the ball's velocity reflected as a result of a collision.
    // This could be handled using an edge normal. Also, this will probably not
    // look right since it's using the radius in the direction of velocity and
    // not in the direction of the edge.
    rewindToCollisionPoint(
      int,
      radius,
      { cpos: edge.e0, ppos: edge.e0, acel: vv2() },
      { cpos: edge.e1, ppos: edge.e1, acel: vv2() }
    );

    const mass1 = 1;
    const mass2 = 10000000;
    const restitution1 = 1;
    const sfriction = 0;
    const dfriction = 0;

    const velOut1 = vv2();
    const velOut2 = vv2();

    collisionResponseAABB(
      int.cpos,
      int.ppos,
      mass1,
      restitution1,
      sfriction,
      dfriction,
      intersectionPoint,
      intersectionPoint,
      mass2,
      restitution1,
      sfriction,
      dfriction,
      projectedResult.edgeNormal,
      velOut1,
      velOut2
    );

    // Apply velocity to integratable only, since edges have a huge mass and are effectively fixed
    // if (mass1 < 10000000)
    sub(int.ppos, int.cpos, velOut1);

    // if (mass2 < 10000000)
    // sub(box2.ppos, box2.cpos, box2v);
  }
}
