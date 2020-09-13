import {
  IntegratableVU,
  ViewportUnitVector2,
  toProjectedPixels,
  ViewportUnits,
  toPixelUnits,
  ViewportCmp,
  vv2,
} from "./viewport";
import { Ball } from "./ball";
import { useCES } from "./components";
import {
  angleOf,
  rotate2d,
  makePointEdgeProjectionResult,
  setVelocity,
} from "./phys-utils";
import { useDebugMode } from "./query-string";
import {
  segmentIntersection,
  projectPointEdge,
  set,
  copy,
  translate,
  sub,
  v2,
  overlapAABBAABB,
  AABBOverlapResult,
} from "pocket-physics";
import { YellowRGBA } from "./theme";
import { GameData, trackOther } from "./game-data";
import { schedule } from "./time";

export type DirectionalAccelerator = {
  int: IntegratableVU;
  enter: ViewportUnitVector2;
  dims: ViewportUnitVector2;
  tracksBall?: boolean;
  appliesAcel: boolean;
};

export function drawAccelerators(das: DirectionalAccelerator[]) {
  for (let i = 0; i < das.length; i++) {
    drawAccelerator(das[i]);
  }
}

function drawAccelerator(da: DirectionalAccelerator) {
  const vp = useCES().selectFirstData("viewport")!;
  const ctx = vp.dprCanvas.ctx;
  const { x, y } = da.int.cpos;
  const halfWidth = da.dims.x / 2;
  // const halfHeight = da.dims.y / 2;

  const quarterWidth = da.dims.x / 4;

  const lineThickness = (vp.vpWidth / 64) as ViewportUnits;
  // This includes the "padding" or negative space lines, too.
  const numLines = da.dims.y / lineThickness;

  // Special triangle
  const boxWidth = (halfWidth * Math.SQRT2) as ViewportUnits;

  // This is 1/2 of the hypotenuse of the corner, which is also the amount we need to offset!
  const offset = ((lineThickness * Math.SQRT2) / 2) as ViewportUnits;

  // Culling: Do not draw if it won't be visible!
  if (
    !overlapAABBAABB(
      vp.camera.target.x,
      vp.camera.target.y,
      vp.camera.frustrum.x * 3,
      vp.camera.frustrum.y * 3,
      x,
      da.dims.x * 2,
      y,
      da.dims.y * 2,
      {
        resolve: v2(),
        hitPos: v2(),
        normal: v2(),
      }
    )
  )
    return;

  ctx.save();
  ctx.fillStyle = YellowRGBA;
  ctx.strokeStyle = YellowRGBA;

  const direction = angleOf(da.enter);

  ctx.translate(toProjectedPixels(x, "x"), toProjectedPixels(y, "y"));

  // The drawing code goes from y -> y+ (up), so we need to compensatel
  ctx.rotate(direction - Math.PI / 2);

  if (process.env.NODE_ENV !== "production") {
    if (useDebugMode()) {
      // Draw the x.y of this component for debugging purposes.
      ctx.beginPath();
      ctx.arc(
        toPixelUnits(0 as ViewportUnits),
        toPixelUnits(0 as ViewportUnits),
        toPixelUnits(1 as ViewportUnits),
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
    }
  }

  drawHalfChevron(
    ctx,
    numLines,
    lineThickness,
    boxWidth,
    0 as ViewportUnits,
    (0 - quarterWidth + offset) as ViewportUnits,
    Math.PI / 4
  );
  drawHalfChevron(
    ctx,
    numLines,
    lineThickness,
    boxWidth,
    0 as ViewportUnits,
    (0 + quarterWidth - offset) as ViewportUnits,
    -Math.PI / 4
  );

  ctx.restore();
}

function drawHalfChevron(
  ctx: CanvasRenderingContext2D,
  numLines: number,
  lineThickness: ViewportUnits,
  boxWidth: ViewportUnits,
  y: ViewportUnits,
  centerX: ViewportUnits,
  rotation: number
) {
  for (let i = 0; i < numLines; i += 2) {
    ctx.save();
    ctx.translate(
      toPixelUnits(centerX as ViewportUnits),
      toPixelUnits((y + i * lineThickness) as ViewportUnits)
    );
    ctx.rotate(rotation);

    const fn = i < Math.floor(numLines / 4) ? ctx.strokeRect : ctx.fillRect;
    fn.call(
      ctx,
      toPixelUnits((0 - boxWidth / 2) as ViewportUnits),
      toPixelUnits(0 as ViewportUnits),
      toPixelUnits(boxWidth),
      toPixelUnits(lineThickness)
    );
    ctx.restore();
  }
}

export function maybeCollideWithAccelerators(
  game: GameData,
  ball: Ball,
  das: DirectionalAccelerator[]
) {
  for (let i = 0; i < das.length; i++) {
    maybeCollideWithAccelerator(game, ball, das[i]);
  }
}

function maybeCollideWithAccelerator(
  game: GameData,
  ball: Ball,
  da: DirectionalAccelerator
) {
  const center = da.int.cpos;
  const halfHeight = (da.dims.y / 2) as ViewportUnits;
  const halfWidth = (da.dims.x / 2) as ViewportUnits;

  // Point the edge at unit circle theta=0
  const e0 = vv2(center.x, center.y + halfWidth);
  const e1 = vv2(center.x, center.y - halfWidth);
  const theta = angleOf(da.enter);

  const e2 = vv2(center.x - halfWidth, center.y - halfWidth);
  const e3 = vv2(center.x + halfWidth, center.y - halfWidth);

  const e4 = vv2(center.x + halfWidth, center.y + halfWidth);
  const e5 = vv2(center.x - halfWidth, center.y + halfWidth);

  // Rotate the edge to match the orientation of the accelerator entraance.
  rotate2d(e0, e0, center, theta);
  rotate2d(e1, e1, center, theta);
  rotate2d(e2, e2, center, theta);
  rotate2d(e3, e3, center, theta);
  rotate2d(e4, e4, center, theta);
  rotate2d(e5, e5, center, theta);

  const edges = [
    [e0, e1],
    [e2, e3],
    [e4, e5],
  ];

  let triggered = false;

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    const intersectionPoint = vv2();
    const intersected = segmentIntersection(
      ball.ppos,
      ball.cpos,
      edge[0],
      edge[1],
      intersectionPoint
    );

    const projection = makePointEdgeProjectionResult();
    projectPointEdge(ball.ppos, edge[0], edge[1], projection);
    if (intersected && projection.similarity < 0) {
      triggered = true;
      break;
    }
  }

  if (triggered) {
    // ball's velocity vector both intersected the segment AND the start of the
    // velocity vector is on the entrance side of the vector, meaning the ball
    // entered from the correct side.

    // TODO: ensure the ball only hits once: once
    // it's in the accelerator, disable checks until it's out (hits the end of
    // the accelerator). something cool that can happen is to track the ball via
    // camera for long tunnels.

    // Place ball perfectly in accelerator
    copy(ball.cpos, da.int.cpos);

    // kill existing velocity
    copy(ball.ppos, ball.cpos);

    // And Go!

    if (da.appliesAcel) {
      set(ball.acel, 5 * da.enter.x, 5 * da.enter.y);
    } else {
      // use velocity to make a series of accelerators smooth
      const velocity = vv2(8 * da.enter.x, 8 * da.enter.y);
      sub(ball.ppos, ball.cpos, velocity);
    }

    if (da.tracksBall) {
      trackOther(ball);
    }
  }
}
