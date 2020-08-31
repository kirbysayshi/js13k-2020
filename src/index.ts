import ScienceHalt from "science-halt";
import { accelerate, inertia, v2, translate, solveDrag } from "pocket-physics";
import { Key } from "ts-key-enum";

import { schedule, tick } from "./time";
import { Loop } from "./loop";

import TestPng from "../assets/00 - Fool.png";
import {
  useCES,
  DrawStepSystem,
  UpdateStepSystem,
  DrawTimeHz,
  UpdateTimeHz,
} from "./components";
import {
  ViewportUnitVector2,
  drawAsset,
  ViewportUnits,
  computeWindowResize,
  vv2,
  moveViewportCamera,
  drawObj,
  toPixelUnits,
  clearScreen,
} from "./viewport";
import { useAsset, loadAssets } from "./asset-map";
import { initDragListeners, dragStateSelector } from "./drag";
import {
  drawPaddle,
  Paddle,
  rotatePaddleLeft,
  rotatePaddleRight,
  getValidPaddleArea,
  movePaddle,
} from "./paddle";
import { useUIRoot, listen, useRootElement } from "./dom";
import { Ball, drawBall, moveAndMaybeBounceBall } from "./ball";
import { setVelocity, rotate2d } from "./phys-utils";
import { drawLevelTarget, LevelTarget, testWinCondition } from "./target";

async function boot() {
  await loadAssets();

  // A component=entity-system(s) is a pattern for managing the lifecycles and
  // structures of differently structured data. It can be thought of as a
  // document database. Each entity (document) has a numeric id. Specific
  // fields and combinations of fields across the entire Store can be queried
  // by `select`ing those fields, as seen below.
  const ces = useCES();

  // create the initial viewport and sizing
  computeWindowResize();

  // initialize touch: look at js13k-2019 for how to use (pointer-target, etc)
  // initDragListeners();

  // A system of an entity-component-system framework is simply a function that
  // is repeatedly called. We separate them into two types based on how often
  // they are invoked: every frame or once every update step (10fps by default).
  const drawStepSystems: DrawStepSystem[] = [];
  const updateStepSystems: UpdateStepSystem[] = [];

  // clear the screen at 60fps
  drawStepSystems.push((ces) => {
    clearScreen();
  });

  // TODO: make a component out of this?
  const screen = ces.selectFirstData("viewport")!;
  const relativeViewArea = getValidPaddleArea(screen);

  const paddle: Paddle = {
    rads: 0,
    width: (screen.vpWidth / 8) as ViewportUnits,
    height: (screen.vpWidth / 16) as ViewportUnits,
    int: {
      acel: vv2(),
      cpos: vv2(),
      ppos: vv2(),
    },
  };

  translate(
    vv2(relativeViewArea.width / 2, relativeViewArea.height / 2),
    paddle.int.cpos,
    paddle.int.ppos
  );

  const ball: Ball = {
    cpos: vv2(),
    ppos: vv2(),
    acel: vv2(),
    width: (screen.vpWidth / 16) as ViewportUnits,
    height: (screen.vpWidth / 16) as ViewportUnits,
  };

  const target: LevelTarget = {
    int: { cpos: vv2(0, 0), ppos: vv2(0, 0), acel: vv2() },
    dims: vv2(10, 10),
  };

  // translate(
  //   v2(relativeViewArea.width / 2, relativeViewArea.height / 2),
  //   ball.cpos,
  //   ball.ppos
  // );

  ball.acel.x = 0.1 as ViewportUnits;
  ball.acel.y = 0.1 as ViewportUnits;

  // Draw "system" updated at 60fps
  drawStepSystems.push(function (ces, interp) {
    drawLevelTarget(target, interp);

    // drawObj(screen.dprCanvas.ctx, { pos: target.int.cpos as ViewportUnitVector2, dim: target.dims });

    // drawPaddle(paddle);
    drawBall(ball, interp);
  });

  updateStepSystems.push((ces, dt) => {

    const { camera } = ces.selectFirstData("viewport")!;

    if (keyInputs.ArrowRight) camera.target.x = camera.target.x + 1 as ViewportUnits;
    if (keyInputs.ArrowLeft) camera.target.x = camera.target.x - 1 as ViewportUnits;
    if (keyInputs.ArrowUp) camera.target.y = camera.target.y + 1 as ViewportUnits;
    if (keyInputs.ArrowDown) camera.target.y = camera.target.y - 1 as ViewportUnits;

    // if (keyInputs.ArrowLeft) rotatePaddleLeft(paddle);
    // if (keyInputs.ArrowRight) rotatePaddleRight(paddle);

    // const paddleAcel = vv2(0.2, 0);
    // const origin = vv2();
    // let angle = 0;
    // if (keyInputs.w && keyInputs.d) angle = -Math.PI / 4;
    // else if (keyInputs.w && keyInputs.a) angle = -Math.PI * (3 / 4);
    // else if (keyInputs.s && keyInputs.d) angle = Math.PI / 4;
    // else if (keyInputs.s && keyInputs.a) angle = Math.PI * (3 / 4);
    // else if (keyInputs.w) angle = -Math.PI / 2;
    // else if (keyInputs.a) angle = Math.PI;
    // else if (keyInputs.s) angle = Math.PI / 2;
    // else if (keyInputs.d) angle = 0;
    // if (angle !== 0 || keyInputs.d)
    //   movePaddle(paddle, rotate2d(vv2(), paddleAcel, origin, angle));

    // solveDrag(paddle.int, 0.8);

    // accelerate(paddle.int, dt);
    // inertia(paddle.int);

    moveAndMaybeBounceBall(ball, paddle, screen, dt);

    // testWinCondition(target, ball);

    // moveViewportCamera(paddle.int.cpos as ViewportUnitVector2);
  });

  const keyInputs: { [K in Key | "w" | "a" | "s" | "d"]?: boolean } = {};

  listen(window, "keydown", (ev) => {
    keyInputs[ev.key as keyof typeof keyInputs] = true;
  });

  listen(window, "keyup", (ev) => {
    keyInputs[ev.key as keyof typeof keyInputs] = false;
  });

  // fps entity
  ces.entity([{ k: "fps", v: 60 }]);

  // Draw the FPS as text on the canvas
  drawStepSystems.push((ces) => {
    const screen = ces.selectFirstData("viewport")!;
    const fpsData = ces.selectFirstData("fps")!;
    const text = fpsData.v.toFixed(2);
    // How many lines of text do we want to be able to display on canvas?
    // Ok, use that as the font size. This assumes the canvas size _ratio_ is fixed but
    // the actual pixel dimensions are not.
    // TODO: The canvas size is currently a fixed ratio, but different physical sizes
    // depending on the screen in order to have crisp pixels regardless. This means all
    // layout must be relative units. This might be a huge problem / difficulty...
    const maxLinesPerCanvas = 44;
    const textSize = screen.height / maxLinesPerCanvas;
    const lineHeight = 1.5;
    // console.log('font', `${textSize}px/${lineHeight} monospace`)
    screen.dprCanvas.ctx.font = `${textSize}px/${lineHeight} monospace`;
    const measure = screen.dprCanvas.ctx.measureText(text);
    const width = measure.width + 1;
    // fillText uses textBaseline as coordinates. "alphabetic" textBaseline is default,
    // so we attempt to compensate by subtracting the text size.
    // For example, drawing "g" at 0,0 will result in only the decender showing on the
    // canvas! We could change the baseline, but then text blocks / paragraphs would be
    // hard to read.
    const height = textSize * lineHeight - textSize;
    screen.dprCanvas.ctx.fillStyle = "rgba(255,255,0,1)";
    screen.dprCanvas.ctx.fillText(
      text,
      screen.width - width,
      screen.height - height
    );
  });

  const { stop } = Loop({
    drawTime: 1000 / DrawTimeHz,
    updateTime: 1000 / UpdateTimeHz,
    update: (dt) => {
      // Increment scheduled actions.
      tick(dt);

      // Update all the "update" systems
      updateStepSystems.forEach((s) => s(ces, dt));

      // Actualy destroy any entities that were marked for destruction. We do
      // this at the end of the update step to avoid race conditions between
      // systems.
      ces.flushDestruction();
    },
    draw: (interp) => {
      // `interp` is a value between 0 and 1 that determines how close we are
      // to the next `update` frame. This allows for smooth animation, even
      // though the actual root values change less frequently than we draw.
      drawStepSystems.forEach((s) => s(ces, interp));
    },
    onPanic,
    onFPS,
  });

  // Turn into dead-code during minification via NODE_ENV check.
  if (process.env.NODE_ENV !== "production") {
    ScienceHalt(() => stop());
  }
}

function onPanic() {
  if (process.env.NODE_ENV !== "production") {
    console.log("panic!");
  }
}

function onFPS(fps: number) {
  const ces = useCES();
  const data = ces.selectFirstData("fps")!;
  data.v = fps;
}

boot();
