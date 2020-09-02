import ScienceHalt from "science-halt";
import { accelerate, inertia, v2, translate, solveDrag } from "pocket-physics";
import { Key } from "ts-key-enum";

import { schedule, tick } from "./time";
import { Loop } from "./loop";

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
  toPixelUnits,
  clearScreen,
  toProjectedPixels,
  toViewportUnits,
  restoreNativeCanvasDrawing,
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
import { level1 } from "./level1";

type GameStates = "boot" | "level" | "win" | "nextlevel";

const game: {
  // ticks spent in this state
  readonly ticks: number;
  readonly prev: null | GameStates;
  readonly state: GameStates;
  readonly level: number;
  readonly levelObjects: {
    paddle: Paddle | null;
    ball: Ball | null;
    target: LevelTarget | null;
  };
} = {
  ticks: 0,
  prev: null,
  state: "boot",
  level: 0,
  levelObjects: {
    paddle: null,
    ball: null,
    target: null,
  },
};

function toState(next: typeof game["state"]) {
  const g: Mutable<typeof game> = game;
  g.prev = g.state;
  g.state = next;
  g.ticks = 0;
}

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

  const screen = ces.selectFirstData("viewport")!;

  // Draw "system" updated at 60fps
  drawStepSystems.push(function (ces, interp) {
    switch (game.state) {
      case "boot": {
        break;
      }
      case "level": {
        const { target, paddle, ball } = game.levelObjects;
        if (!target || !paddle || !ball) return;
        drawLevelTarget(target!, interp);
        drawPaddle(paddle!);
        drawBall(ball!, interp);

        break;
      }

      case "win": {

        // TODO: extract this into a "drawTextLines()" function
        const vp = ces.selectFirstData("viewport")!;
        const { ctx } = vp.dprCanvas;
        ctx.save();
        const maxLinesPerCanvas = 5;
        const textSize = vp.height / maxLinesPerCanvas;
        const lineHeight = 1.5;
        ctx.font = `${textSize}px/${lineHeight} monospace`;
        const text = "YOU\nWIN";

        restoreNativeCanvasDrawing(vp);
        ctx.fillStyle = "black";

        let y = 0;
        text.split("\n").forEach((line) => {
          const measure = ctx.measureText(line);
          const width = measure.width + 1;
          const height =
            "actualBoundingBoxAscent" in measure
              ? measure.actualBoundingBoxAscent +
                measure.actualBoundingBoxDescent
              : textSize * lineHeight - textSize;
          y += height;
          ctx.fillText(
            line,
            toPixelUnits((vp.vpWidth / 2) as ViewportUnits) - width / 2,
            y
          );
        });

        ctx.restore();
        break;
      }

      case "nextlevel": {
        break;
      }

      default: {
        const _n: never = game.state;
      }
    }
  });

  updateStepSystems.push((ces, dt) => {
    switch (game.state) {
      case "boot": {
        console.log("boot");
        // TODO: tap / push a button to start

        return toState("nextlevel");
      }
      case "level": {
        if (game.ticks === 0) {
          // initialize on first tick
          (game as Mutable<typeof game>).levelObjects = level1();
        }

        const { target, paddle, ball } = game.levelObjects;

        // Copy these out using Quoted Property access to tell terser to not
        // mangle. Terser doesn't know these values come directly from the
        // event.key DOM API.
        const ArrowLeft = keyInputs['ArrowLeft'];
        const ArrowRight = keyInputs['ArrowRight'];
        const KeyW = keyInputs['w'];
        const KeyA = keyInputs['a'];
        const KeyS = keyInputs['s'];
        const KeyD = keyInputs['d'];

        if (ArrowLeft) rotatePaddleLeft(paddle!);
        if (ArrowRight) rotatePaddleRight(paddle!);

        const paddleAcel = vv2(0.2, 0);
        const origin = vv2();
        let angle = 0;
        if (KeyW && KeyD) angle = Math.PI / 4;
        else if (KeyW && KeyA) angle = Math.PI * (3 / 4);
        else if (KeyS && KeyD) angle = -Math.PI / 4;
        else if (KeyS && KeyA) angle = -Math.PI * (3 / 4);
        else if (KeyW) angle = Math.PI / 2;
        else if (KeyA) angle = Math.PI;
        else if (KeyS) angle = -Math.PI / 2;
        else if (KeyD) angle = 0;
        if (angle !== 0 || KeyD)
          movePaddle(paddle!, rotate2d(vv2(), paddleAcel, origin, angle));

        if (testWinCondition(target!, ball!)) {
          return toState("win");
        }
        break;
      }

      case "win": {
        if (game.ticks === 0) {
          schedule(() => {
            return toState("nextlevel");
          }, 5000);
        }
        break;
      }

      case "nextlevel": {
        const g: Mutable<typeof game> = game;
        g.level += 1;
        return toState("level");
      }

      default: {
        const _n: never = game.state;
      }
    }

    const { target, paddle, ball } = game.levelObjects;
    if (target && paddle && ball) {
      solveDrag(paddle.int, 0.8);

      accelerate(paddle.int, dt);
      inertia(paddle.int);

      moveAndMaybeBounceBall(ball, paddle, screen, dt);
      moveViewportCamera(paddle.int.cpos as ViewportUnitVector2);
    }

    (game as Mutable<typeof game>).ticks += 1;
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
    const maxLinesPerCanvas = 44;
    const textSize = screen.height / maxLinesPerCanvas;
    const lineHeight = 1.5;
    const { ctx } = screen.dprCanvas;

    ctx.save();
    ctx.fillStyle = "rgba(255,255,0,1)";
    ctx.font = `${textSize}px/${lineHeight} monospace`;

    // fillText uses textBaseline as coordinates. "alphabetic" textBaseline is default,
    // so we attempt to compensate by subtracting the text size.
    // For example, drawing "g" at 0,0 will result in only the decender showing on the
    // canvas! We could change the baseline, but then text blocks / paragraphs would be
    // hard to read.
    const measure = ctx.measureText(text);
    const width = measure.width + 1;
    const height =
      "actualBoundingBoxAscent" in measure
        ? measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent
        : textSize * lineHeight - textSize;

    // Undo the scale / translation of the camera canvas since we want to draw independent of camera
    // 0,0 is now upper right, y+ is downwards
    restoreNativeCanvasDrawing(screen);

    // Draw bottom right
    // ctx.fillText(text,
    //   toPixelUnits(screen.vpWidth) - width,
    //   toPixelUnits(screen.vpHeight) - height,
    // );

    ctx.fillText(text, toPixelUnits(screen.vpWidth) - width, 0 + height);

    ctx.restore();
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
