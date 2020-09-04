import { useCES, UpdateTimeDelta } from "./components";
import {
  drawTextLines,
  vv2,
  ViewportUnitVector2,
  toPixelUnits,
  toProjectedPixels,
  ViewportUnits,
} from "./viewport";
import { GameData } from "./game-data";
import { v2, overlapAABBAABB, AABBOverlapResult, projectPointEdge, Vector2 } from "pocket-physics";
import { makePointEdgeProjectionResult, vd } from "./phys-utils";

export function drawLevelUI(game: GameData, interp: number) {
  const vp = useCES().selectFirstData("viewport")!;

  const time = ((game.ticks * UpdateTimeDelta) / 1000).toFixed(3);
  drawTextLines(time, vv2(vp.vpWidth / 2, 0), "center", 44, "yellow");

  drawTextLines(`Level ${game.level} of ??`, vv2(0, 0), "left", 44, "yellow");

  if (game.levelObjects.target)
    drawPointer(
      game.levelObjects.target.int.cpos,
      game.levelObjects.target.dims,
      "blue",
      "TARGET"
    );
}

function drawPointer(
  target: ViewportUnitVector2,
  wh: ViewportUnitVector2,
  color: "yellow" | "blue",
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
    const [ e0, e1, result ] = segments[i];
    projectPointEdge(target, e0, e1, result);
    if (result.similarity > 0) console.log(`target is outside ${i}: ${vd(e0)}->${vd(e1)} by ${result.distance}`);

    // TODO: if outside of two at once, use corner
  }
}
