import { useCES } from "./components";
import {
  drawTextLinesInViewport,
  vv2,
  ViewportUnitVector2,
  drawTextLinesInWorld,
  predictTextHeight,
} from "./viewport";
import { GameData, ticksAsSeconds, formatSeconds } from "./game-data";
import { projectPointEdge, distance } from "pocket-physics";
import { makePointEdgeProjectionResult, vd } from "./phys-utils";
import {
  YellowRGBA,
  BodyTextLines,
  BlackRGBA,
  Transparent,
  TitleTextFont,
} from "./theme";

export function drawLevelUI(game: GameData, interp: number) {
  const vp = useCES().selectFirstData("viewport")!;

  if (!game.levelObjects) return;

  const time = formatSeconds(ticksAsSeconds(game.ticks));
  drawTextLinesInViewport(
    time,
    vv2(vp.vpWidth / 2, -1),
    "center",
    BodyTextLines,
    YellowRGBA
  );

  drawTextLinesInViewport(
    `MISSION ${game.level + 1}: ${game.levelObjects.flavorText.toUpperCase()}`,
    vv2(vp.camera.frustrum.x, -vp.camera.frustrum.y * 2),
    "center",
    BodyTextLines,
    YellowRGBA,
    Transparent,
    TitleTextFont
  );

  drawPointer(
    game.levelObjects.target.int.cpos,
    game.levelObjects.target.dims,
    "blue",
    "TARGET"
  );

  drawPointer(
    game.levelObjects.ball.cpos,
    // TODO: make this into a persistent vv2!
    vv2(game.levelObjects.ball.width, game.levelObjects.ball.height),
    YellowRGBA,
    "SIGNAL"
  );
}

function drawPointer(
  target: ViewportUnitVector2,
  wh: ViewportUnitVector2,
  color: YellowRGBA | "blue",
  label: string
) {
  // given a world point and label, draw an arrow / triangle that follows the
  // object, pinning to the edge of the viewport if the object is outside the
  // camera
  // if object is fully bounded in viewport:
  // draw \ text /
  // else
  // find farthest viewport edge (top, right, bottom, left)
  // use the corner if target is in opposite rectangle
  /*
          |     |                  x
          |     |
          |-----|-----------------------
          |     |
          |  vp |
          |-----|
          |     |
          |     |

  */

  // TODO: extract this to a camera culling -ish function
  const vp = useCES().selectFirstData("viewport")!;
  const camera = vp.camera.target;
  const { frustrum } = vp.camera;

  // These segments are "wound" to ensure the normals face the outward direction (a->b, normal is up)
  const segments = [
    // top
    [
      vv2(camera.x - frustrum.x, camera.y + frustrum.y),
      vv2(camera.x + frustrum.x, camera.y + frustrum.y),
      makePointEdgeProjectionResult(),
    ],

    // right
    [
      vv2(camera.x + frustrum.x, camera.y + frustrum.y),
      vv2(camera.x + frustrum.x, camera.y - frustrum.y),
      makePointEdgeProjectionResult(),
    ],

    // bottom (lower right -> lower left)
    [
      vv2(camera.x + frustrum.x, camera.y - frustrum.y),
      vv2(camera.x - frustrum.x, camera.y - frustrum.y),
      makePointEdgeProjectionResult(),
    ],

    // left (lower left -> upper left)
    [
      vv2(camera.x - frustrum.x, camera.y - frustrum.y),
      vv2(camera.x - frustrum.x, camera.y + frustrum.y),
      makePointEdgeProjectionResult(),
    ],
  ] as const;

  for (let i = 0; i < segments.length; i++) {
    const [e0, e1, result] = segments[i];
    projectPointEdge(target, e0, e1, result);
  }

  const [
    [top0, top1, top],
    [right0, right1, right],
    [bottom0, bottom1, bottom],
    [left0, left1, left],
  ] = segments;

  let point;
  let dist;
  let pin: "right" | "left" | "center";

  const prediction = predictTextHeight(label, BodyTextLines);

  if (top.similarity > 0 && right.similarity > 0) {
    point = vv2(right.projectedPoint.x, top.projectedPoint.y);
    dist = distance(point, target);
    pin = "right";
  } else if (right.similarity > 0 && bottom.similarity > 0) {
    point = vv2(
      right.projectedPoint.x,
      bottom.projectedPoint.y + prediction.predictedSingleLineHeight
    );
    dist = distance(point, target);
    pin = "right";
  } else if (bottom.similarity > 0 && left.similarity > 0) {
    point = vv2(
      left.projectedPoint.x,
      bottom.projectedPoint.y + prediction.predictedSingleLineHeight
    );
    dist = distance(point, target);
    pin = "left";
  } else if (left.similarity > 0 && top.similarity > 0) {
    point = vv2(left.projectedPoint.x, top.projectedPoint.y);
    dist = distance(point, target);
    pin = "left";
  } else if (top.similarity > 0) {
    point = vv2(
      Math.min(Math.max(top.projectedPoint.x, top0.x), top1.x),
      top.projectedPoint.y
    );
    dist = top.distance;
    pin = "center";
  } else if (right.similarity > 0) {
    point = vv2(
      right.projectedPoint.x,
      Math.max(Math.min(right0.y, right.projectedPoint.y), right1.y)
    );
    dist = right.distance;
    pin = "right";
  } else if (bottom.similarity > 0) {
    point = vv2(
      Math.max(Math.min(bottom0.x, bottom.projectedPoint.x), bottom1.x),
      bottom.projectedPoint.y + prediction.predictedSingleLineHeight
    );
    dist = bottom.distance;
    pin = "center";
  } else if (left.similarity > 0) {
    point = vv2(
      left.projectedPoint.x,
      Math.min(Math.max(left0.y, left.projectedPoint.y), left1.y)
    );
    dist = left.distance;
    pin = "left";
  } else {
    return;
  }

  const averageHalfSize = (wh.x / 2 + wh.y / 2) / 2;

  // don't draw if too close
  if (dist < averageHalfSize * 0.7) return;

  const ctx = vp.dprCanvas.ctx;
  ctx.save();

  // Draw label
  drawTextLinesInWorld(label, point, pin, BodyTextLines, BlackRGBA, YellowRGBA);

  ctx.restore();
}
