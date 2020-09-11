import { useCES } from "./components";
import { ViewportUnits, toProjectedPixels, toPixelUnits } from "./viewport";
import { DPRCanvas, makeDPRCanvas } from "./canvas";
import { useRandom } from "./rng";
import { useDebugMode } from "./query-string";
import { BlackRGBA, YellowRGBA } from "./theme";

function drawBGGrid() {
  // draw lines every 5 viewport units?
  // given the camera position, "find" lines within the camera bounds

  const {
    camera,
    dprCanvas: { ctx },
  } = useCES().selectFirstData("viewport")!;

  const cellWidth = 5 as ViewportUnits;

  const leftmostVertical = Math.floor(
    (camera.target.x - camera.frustrum.x) / cellWidth
  );
  const rightmostVertical = Math.floor(
    (camera.target.x + camera.frustrum.x) / cellWidth
  );

  const topmostHorizontal = Math.floor(
    (camera.target.y + camera.frustrum.y) / cellWidth
  );
  const bottommostHorizontal = Math.floor(
    (camera.target.y - camera.frustrum.y) / cellWidth
  );

  ctx.strokeStyle = "gray";

  // Draw vertical lines (X)
  for (let i = leftmostVertical; i <= rightmostVertical; i++) {
    const x = toProjectedPixels((i * cellWidth) as ViewportUnits, "x");
    const y0 = toProjectedPixels(
      (camera.target.y + camera.frustrum.y) as ViewportUnits,
      "y"
    );
    const y1 = toProjectedPixels(
      (camera.target.y - camera.frustrum.y) as ViewportUnits,
      "y"
    );
    ctx.beginPath();
    ctx.moveTo(x, y0);
    ctx.lineTo(x, y1);
    ctx.stroke();
  }

  // Draw horizontal lines (Y)
  for (let i = bottommostHorizontal + 1; i <= topmostHorizontal; i++) {
    const y = toProjectedPixels((i * cellWidth) as ViewportUnits, "y");
    const x0 = toProjectedPixels(
      (camera.target.x - camera.frustrum.x) as ViewportUnits,
      "x"
    );
    const x1 = toProjectedPixels(
      (camera.target.x + camera.frustrum.x) as ViewportUnits,
      "x"
    );
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
  }
}

let starfield: DPRCanvas;

export function drawStarfield() {
  // generate one square large enough for 4 view areas, then tile it

  const vp = useCES().selectFirstData("viewport")!;
  const { camera } = vp;

  // generated a starfield 4x the size of the camera area
  const genWidth = (camera.frustrum.x * 2) as ViewportUnits;
  const genHeight = (camera.frustrum.y * 2) as ViewportUnits;

  if (!starfield) {
    const cvs = document.createElement("canvas");
    const ctx = cvs.getContext("2d")!;
    // make a canvas 2x the size of the camera
    starfield = makeDPRCanvas(
      toPixelUnits((vp.camera.frustrum.x * 2) as ViewportUnits),
      toPixelUnits((vp.camera.frustrum.y * 2) as ViewportUnits),
      cvs
    );

    const minSize = 0.1 as ViewportUnits;
    const maxSize = 0.3 as ViewportUnits;
    const max = 8 * (vp.camera.frustrum.y * 2);

    ctx.fillStyle = YellowRGBA;

    let created = 0;
    while (created < max) {
      const x = (useRandom() * genWidth) as ViewportUnits;
      const y = (useRandom() * genHeight) as ViewportUnits;
      const size = (useRandom() * (maxSize - minSize) +
        minSize) as ViewportUnits;

      ctx.beginPath();
      ctx.arc(
        toPixelUnits(x),
        toPixelUnits(y),
        toPixelUnits(size),
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      created++;
    }
  }

  // draw existing starfield onto the canvas appropriately

  const xTileUnits = camera.target.x / genWidth;
  const yTileUnits = camera.target.y / genHeight;

  const xTile = Math.floor(xTileUnits);
  const yTile = Math.floor(yTileUnits);

  let xTileRemainder = (camera.target.x % genWidth) / genWidth;
  let yTileRemainder = (camera.target.y % genHeight) / genHeight;

  xTileRemainder = camera.target.x < 0
    ? 1 - Math.abs(xTileRemainder)
    : xTileRemainder;
  
  yTileRemainder = camera.target.y < 0
    ? 1 - Math.abs(yTileRemainder)
    : yTileRemainder;

  const ctx = vp.dprCanvas.ctx;

  // draw black background
  ctx.fillStyle = BlackRGBA;
  ctx.fillRect(
    toProjectedPixels(
      (camera.target.x - camera.frustrum.x) as ViewportUnits,
      "x"
    ),
    toProjectedPixels(
      (camera.target.y + camera.frustrum.y) as ViewportUnits,
      "y"
    ),
    toPixelUnits((camera.frustrum.x * 2) as ViewportUnits),
    toPixelUnits((-camera.frustrum.y * 2) as ViewportUnits)
  );

  // draw starfield camera is intersecting
  ctx.drawImage(
    starfield.cvs,
    0,
    0,
    toPixelUnits(genWidth),
    toPixelUnits(genHeight),
    toProjectedPixels((xTile * genWidth) as ViewportUnits, "x"),
    toProjectedPixels((yTile * genHeight) as ViewportUnits, "y"),
    toPixelUnits(genWidth),
    toPixelUnits(genHeight)
  );

  // only draw the rest 

  if (xTileRemainder < 0.5)
  ctx.drawImage(
    starfield.cvs,
    0,
    0,
    toPixelUnits(genWidth),
    toPixelUnits(genHeight),
    toProjectedPixels(((xTile - 1) * genWidth) as ViewportUnits, "x"),
    toProjectedPixels((yTile * genHeight) as ViewportUnits, "y"),
    toPixelUnits(genWidth),
    toPixelUnits(genHeight)
  );

  if (xTileRemainder >= 0.5)
  ctx.drawImage(
    starfield.cvs,
    0,
    0,
    toPixelUnits(genWidth),
    toPixelUnits(genHeight),
    toProjectedPixels(((xTile + 1) * genWidth) as ViewportUnits, "x"),
    toProjectedPixels((yTile * genHeight) as ViewportUnits, "y"),
    toPixelUnits(genWidth),
    toPixelUnits(genHeight)
  );

  if (yTileRemainder < 0.5)
  ctx.drawImage(
    starfield.cvs,
    0,
    0,
    toPixelUnits(genWidth),
    toPixelUnits(genHeight),
    toProjectedPixels((xTile * genWidth) as ViewportUnits, "x"),
    toProjectedPixels(((yTile - 1) * genHeight) as ViewportUnits, "y"),
    toPixelUnits(genWidth),
    toPixelUnits(genHeight)
  );

  if (yTileRemainder >= 0.5)
  ctx.drawImage(
    starfield.cvs,
    0,
    0,
    toPixelUnits(genWidth),
    toPixelUnits(genHeight),
    toProjectedPixels((xTile * genWidth) as ViewportUnits, "x"),
    toProjectedPixels(((yTile + 1) * genHeight) as ViewportUnits, "y"),
    toPixelUnits(genWidth),
    toPixelUnits(genHeight)
  );

  if (xTileRemainder < 0.5 && yTileRemainder < 0.5)
  ctx.drawImage(
    starfield.cvs,
    0,
    0,
    toPixelUnits(genWidth),
    toPixelUnits(genHeight),
    toProjectedPixels(((xTile - 1) * genWidth) as ViewportUnits, "x"),
    toProjectedPixels(((yTile - 1) * genHeight) as ViewportUnits, "y"),
    toPixelUnits(genWidth),
    toPixelUnits(genHeight)
  );

  if (xTileRemainder >= 0.5 && yTileRemainder < 0.5)
  ctx.drawImage(
    starfield.cvs,
    0,
    0,
    toPixelUnits(genWidth),
    toPixelUnits(genHeight),
    toProjectedPixels(((xTile + 1) * genWidth) as ViewportUnits, "x"),
    toProjectedPixels(((yTile - 1) * genHeight) as ViewportUnits, "y"),
    toPixelUnits(genWidth),
    toPixelUnits(genHeight)
  );

  if (xTileRemainder < 0.5 && yTileRemainder >= 0.5)
  ctx.drawImage(
    starfield.cvs,
    0,
    0,
    toPixelUnits(genWidth),
    toPixelUnits(genHeight),
    toProjectedPixels(((xTile - 1) * genWidth) as ViewportUnits, "x"),
    toProjectedPixels(((yTile + 1) * genHeight) as ViewportUnits, "y"),
    toPixelUnits(genWidth),
    toPixelUnits(genHeight)
  );

  if (xTileRemainder >= 0.5 && yTileRemainder >= 0.5)
  ctx.drawImage(
    starfield.cvs,
    0,
    0,
    toPixelUnits(genWidth),
    toPixelUnits(genHeight),
    toProjectedPixels(((xTile + 1) * genWidth) as ViewportUnits, "x"),
    toProjectedPixels(((yTile + 1) * genHeight) as ViewportUnits, "y"),
    toPixelUnits(genWidth),
    toPixelUnits(genHeight)
  );

  if (process.env.NODE_ENV !== 'production') {
    if (useDebugMode()) drawBGGrid();
  }
}
