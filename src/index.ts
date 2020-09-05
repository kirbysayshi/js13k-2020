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
  DrawTimeDelta,
  UpdateTimeDelta,
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
  drawTextLinesInViewport,
  drawTextLinesInWorld,
} from "./viewport";
import { useAsset, loadAssets } from "./asset-map";
import { initDragListeners, dragStateSelector } from "./drag";
import {
  drawPaddle,
  rotatePaddleLeft,
  rotatePaddleRight,
  getValidPaddleArea,
  movePaddle,
} from "./paddle";
import { useUIRoot, listen, useRootElement } from "./dom";
import { drawBall, moveAndMaybeBounceBall } from "./ball";
import { setVelocity, rotate2d } from "./phys-utils";
import { drawLevelTarget, testWinCondition } from "./target";
import { level01 } from "./level01";
import { level02 } from './level02';
import { game, toState } from "./game-data";
import { drawLevelUI } from "./level-ui";

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
        drawLevelUI(game, interp);
        break;
      }

      case "win": {
        const vp = ces.selectFirstData("viewport")!;
        drawTextLinesInViewport('YOU\nWIN', vv2(vp.vpWidth / 2, 0), 'center', 5, 'black');
        break;
      }

      case "nextlevel": {
        break;
      }

      case "thanks": {
        console.log('thanks!');
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

          const levels = [
            level01,
            level02
          ];

          const level = levels[game.level];

          if (!level) {
            return toState('thanks');
          }

          (game as Mutable<typeof game>).levelObjects = level();
        }

        const { target, paddle, ball } = game.levelObjects;

        if (keyInputs.ArrowLeft) rotatePaddleLeft(paddle!);
        if (keyInputs.ArrowRight) rotatePaddleRight(paddle!);

        const paddleAcel = vv2(0.2, 0);
        const origin = vv2();
        let angle = 0;
        if (keyInputs.w && keyInputs.d) angle = Math.PI / 4;
        else if (keyInputs.w && keyInputs.a) angle = Math.PI * (3 / 4);
        else if (keyInputs.s && keyInputs.d) angle = -Math.PI / 4;
        else if (keyInputs.s && keyInputs.a) angle = -Math.PI * (3 / 4);
        else if (keyInputs.w) angle = Math.PI / 2;
        else if (keyInputs.a) angle = Math.PI;
        else if (keyInputs.s) angle = -Math.PI / 2;
        else if (keyInputs.d) angle = 0;
        if (angle !== 0 || keyInputs.d)
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
        g.levelObjects.ball = null;
        g.levelObjects.paddle = null;
        g.levelObjects.target = null;
        return toState("level");
      }

      case "thanks": {
        // animation to tally up scores?
        break;
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

  // These keys must be quoted to force terser to keep these keys as is. It
  // doesn't know they come from the DOM Keyboard API. Prettier wants to remove
  // the quotes, so disable it.
  const keyInputs: {
    [K in
      | Extract<Key, Key.ArrowLeft | Key.ArrowRight>
      | "w"
      | "a"
      | "s"
      | "d"]: boolean;
  } = {
    // prettier-ignore
    'w': false,
    // prettier-ignore
    'a': false,
    // prettier-ignore
    's': false,
    // prettier-ignore
    'd': false,
    // prettier-ignore
    'ArrowLeft': false,
    // prettier-ignore
    'ArrowRight': false,
  };

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
    const fpsData = ces.selectFirstData("fps")!;
    drawTextLinesInViewport(fpsData.v.toFixed(2), vv2(100, 0), 'right', 44, 'yellow');
  });

  const { stop } = Loop({
    drawTime: DrawTimeDelta,
    updateTime: UpdateTimeDelta,
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
