import {
  useCES,
  MovementCmp,
  SpringConstraintCmp,
  EntityDefSelector,
} from "./components";
import { DPRCanvas, makeDPRCanvas } from "./canvas";
import { usePrimaryCanvas, useRootElement } from "./dom";
import {
  Vector2,
  Integratable,
  v2,
  translate,
  sub,
  copy,
  scale,
  add,
} from "pocket-physics";
import { AssuredEntityId } from "./ces";

type Pixels = number & { _isPixels: true };

export type ViewportUnits<T = number> = T & { _isViewportUnits: true };
export function asViewportUnits(n: number) {
  return n as ViewportUnits;
}
export type ViewportUnitVector2 = {
  x: ViewportUnits;
  y: ViewportUnits;
};

export function vv2(x: number = 0, y: number = 0) {
  return v2(x, y) as ViewportUnitVector2;
}

export type IntegratableVU = {
  cpos: ViewportUnitVector2;
  ppos: ViewportUnitVector2;
  acel: ViewportUnitVector2;
};

type Camera = {
  // if mode === center, helf width offset from center
  frustrum: ViewportUnitVector2;
  mode: "center";
  target: ViewportUnitVector2;
};

export type ViewportCmp = {
  k: "viewport";
  ratio: number;
  width: Pixels;
  height: Pixels;
  vpWidth: ViewportUnits<100>;
  vpHeight: ViewportUnits;
  dprCanvas: DPRCanvas;

  camera: Camera;
};

function toPixelUnitsVec(out: Vector2, v: ViewportUnitVector2) {
  const ces = useCES();
  const vp = ces.selectFirstData("viewport")!;
  const cvs = vp.dprCanvas;

  scale(out, v, 1 / vp.vpWidth);
  scale(out, out, cvs.width);

  out.x = Math.floor(out.x);
  out.y = Math.floor(out.y);

  return out as { x: Pixels; y: Pixels };
}

// Ignore the camera's position when computing pixel values (for relative use only)
export function toPixelUnits(n: ViewportUnits) {
  const ces = useCES();
  const vp = ces.selectFirstData("viewport")!;
  const cvs = vp.dprCanvas;

  // This causes jittering...
  // const px = Math.floor((n / vp.vpWidth) * cvs.width);
  const px =(n / vp.vpWidth) * cvs.width;
  return px as Pixels;
}

// Account for the camera position when computing pixel values
export function toProjectedPixels(n: ViewportUnits, axis: "x" | "y") {
  // TODO: perhaps make this a method on camera instead to avoid so many lookups.
  const ces = useCES();
  const vp = ces.selectFirstData("viewport")!;
  const { camera } = vp;
  return toPixelUnits(
    (n - (axis === "x" ? camera.target.x : camera.target.y)) as ViewportUnits
  );
}

export const toViewportUnits = (n: number): ViewportUnits => {
  const ces = useCES();
  const vp = ces.selectFirstData("viewport");
  if (process.env.NODE_ENV !== "production") {
    if (!vp)
      throw new Error(
        "tried to compute pixel units without a viewport defined!"
      );
  }
  const units = (n / vp!.dprCanvas.width) * 100;
  return units as ViewportUnits;
};

export function moveViewportCamera(toPos: ViewportUnitVector2) {
  const ces = useCES();
  const vp = ces.selectFirstData("viewport")!;
  copy(vp.camera.target, toPos);
}

export function restoreNativeCanvasDrawing(vp: ViewportCmp) {
  const { ctx } = vp.dprCanvas;
  const { camera } = vp;
  ctx.scale(1, -1);
  ctx.translate(
    -toPixelUnits(camera.frustrum.x),
    -toPixelUnits(camera.frustrum.y)
  );
}

export function clearScreen() {
  const ces = useCES();
  const vp = ces.selectFirstData("viewport")!;
  const { ctx } = vp.dprCanvas;
  ctx.save();
  restoreNativeCanvasDrawing(vp);
  ctx.clearRect(0, 0, vp.dprCanvas.cvs.width, vp.dprCanvas.cvs.height);
  ctx.restore();
}

// TODO: this is currently "absolutely" positioned only, and not camera aware. Make it camera aware. units=world|viewport?
export function drawTextLinesInViewport(
  text: string,
  start: ViewportUnitVector2,
  alignment: "center" | "left" | "right",
  maxLinesPerCanvas: number,
  color: "yellow" | "black"
) {

  const ces = useCES();
  const vp = ces.selectFirstData("viewport")!;
  const { camera } = vp;

  // translate "relative" viewport position to world coordinates
  const corrected = vv2();
  corrected.x = camera.target.x - camera.frustrum.x as ViewportUnits;
  corrected.y = camera.target.y + camera.frustrum.y as ViewportUnits;
  add(corrected, corrected, start);
  
  drawTextLinesInWorld(text, corrected, alignment, maxLinesPerCanvas, color);
}

export function drawTextLinesInWorld(
  text: string,
  start: ViewportUnitVector2,
  alignment: "center" | "left" | "right",
  maxLinesPerCanvas: number,
  color: "yellow" | "black"
) {
  const ces = useCES();
  const vp = ces.selectFirstData("viewport")!;
  const {camera} = vp;
  const { ctx } = vp.dprCanvas;
  ctx.save();
  const textSize = vp.height / maxLinesPerCanvas;
  const lineHeight = 1.5;
  ctx.font = `${textSize}px/${lineHeight} monospace`;

  // Flip back to +y down to make text correct orientation
  ctx.scale(1, -1)
  ctx.fillStyle = color;

  const toReverseYProjected = (n: ViewportUnits) => toPixelUnits(
    (n + (camera.target.y)) as ViewportUnits
  );

  let y = toReverseYProjected(-start.y as ViewportUnits);
  text.split("\n").forEach((line) => {
    const measure = ctx.measureText(line);
    const width = measure.width + 1;
    const height = measure.actualBoundingBoxAscent
      ? measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent
      : ((textSize * lineHeight - textSize) as Pixels);
    y = (y + height) as Pixels;
    ctx.fillText(
      line,
      alignment === "center"
        ? toProjectedPixels(start.x, 'x') - width / 2
        : alignment === "left"
        ? toProjectedPixels(start.x, 'x')
        : toProjectedPixels(start.x, 'x') - width,
      y
    );
  });

  ctx.restore();
}

// TODO: account for flipped Y
export function drawAsset(
  asset: HTMLImageElement,
  interp: number,
  cpos: Vector2,
  ppos: Vector2,
  width: ViewportUnits,
  height: ViewportUnits = width,
  center = false
) {
  const ces = useCES();
  const vp = ces.selectFirstData("viewport");

  const x = toPixelUnits(
    (ppos.x + interp * (cpos.x - ppos.x)) as ViewportUnits
  );
  const y = toPixelUnits(
    (ppos.y + interp * (cpos.y - ppos.y)) as ViewportUnits
  );

  const pxWidth = toPixelUnits(width);
  const pxHeight = toPixelUnits(height);

  vp!.dprCanvas.ctx.drawImage(
    asset,
    0,
    0,
    asset.width,
    asset.height,
    center ? x - pxWidth / 2 : x,
    center ? y - pxHeight / 2 : y,
    pxWidth,
    pxHeight
  );
}

export function deriveViewportCmp(): ViewportCmp {
  const ratio = 0.6;

  // if the window is taller than wide, use the window width for the width.
  // Otherwise, use the ratio to derive the width from the window height
  const width =
    window.innerWidth < window.innerHeight
      ? window.innerWidth
      : window.innerHeight * ratio;

  // if the window is taller than wide, use the window width to derive the height.
  // Otherwise, use the window height as the height.
  const height =
    window.innerWidth < window.innerHeight
      ? window.innerWidth / ratio
      : window.innerHeight;

  const dprCanvas = makeDPRCanvas(width, height, usePrimaryCanvas());
  const camera = {
    frustrum: vv2(50, 50),
    mode: "center" as const,
    target: vv2(0, 0),
  };

  return {
    k: "viewport",
    ratio,
    width: width as Pixels,
    height: height as Pixels,
    vpWidth: 100 as ViewportUnits<100>,
    vpHeight: (100 / 0.6) as ViewportUnits,
    dprCanvas,
    camera,
  };
}

export function computeWindowResize() {
  const cmp = deriveViewportCmp();
  const ces = useCES();

  // On resize, destroy existing component and depdendent components.
  const existingId = ces.selectFirst(["viewport"]);
  if (existingId) {
    ces.destroy(existingId);
  }

  const root = useRootElement();
  root.style.width = cmp.width + "px";

  const toPx = (n: number) =>
    Math.floor((n / cmp.vpWidth) * cmp.dprCanvas.cvs.width);
  cmp.dprCanvas.ctx.translate(
    toPx(cmp.camera.frustrum.x),
    toPx(cmp.camera.frustrum.y)
  );
  // Force +y to be UP. Remember to reverse when writing text or image!
  // https://usefulangle.com/post/18/javascript-html5-canvas-solving-problem-of-inverted-text-when-y-axis-flipped
  cmp.dprCanvas.ctx.scale(1, -1);

  const def = [cmp];
  ces.entity(def);
}

window.addEventListener("resize", computeWindowResize);
