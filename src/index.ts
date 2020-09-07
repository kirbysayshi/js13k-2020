import { accelerate, inertia, solveDrag } from "pocket-physics";
import ScienceHalt from "science-halt";
import { loadAssets } from "./asset-map";
import { drawBall, moveAndMaybeBounceBall } from "./ball";
import { drawBGForCamera } from "./bg";
import {
  DrawStepSystem,
  DrawTimeDelta,
  UpdateStepSystem,
  UpdateTimeDelta,
  useCES,
} from "./components";
import { drawEdges, processEdges } from "./edge";
import { game, toState, ticksAsSeconds, formatSeconds } from "./game-data";
import { useKeyInputs } from "./keys";
import { drawLevelUI } from "./level-ui";
import { level01 } from "./level01";
import { level02 } from "./level02";
import { level03 } from "./level03";
import { Loop } from "./loop";
import {
  drawPaddle,
  movePaddle,
  rotatePaddleLeft,
  rotatePaddleRight,
} from "./paddle";
import { rotate2d } from "./phys-utils";
import { drawLevelTarget, testWinCondition } from "./target";
import { schedule, tick } from "./time";
import {
  clearScreen,
  computeWindowResize,
  drawTextLinesInViewport,
  moveViewportCamera,
  ViewportUnitVector2,
  vv2,
} from "./viewport";
import { drawFps, onFPS } from "./fps";

async function boot() {
  await loadAssets();

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
        const { target, paddle, ball, edges } = game.levelObjects;
        if (!target || !paddle || !ball) return;
        drawBGForCamera();
        drawLevelTarget(target!, interp);
        drawPaddle(paddle!);
        drawBall(ball!, interp);
        if (edges) drawEdges(edges);
        drawLevelUI(game, interp);
        break;
      }

      case "win": {
        const vp = ces.selectFirstData("viewport")!;
        const levelTime = formatSeconds(
          ticksAsSeconds(game.levelTicks[game.level])
        );
        drawTextLinesInViewport(
          `Mission\nCompleted!\n${levelTime}s`,
          vv2(vp.vpWidth / 2, -10),
          "center",
          15,
          "yellow"
        );
        break;
      }

      case "nextlevel": {
        break;
      }

      case "thanks": {

        const totalTicks = game.levelTicks.reduce((total, ticks) => {
          total += ticks;
          return total;
        }, 0);

        const seconds = formatSeconds(ticksAsSeconds(totalTicks));

        const vp = ces.selectFirstData("viewport")!;
        drawTextLinesInViewport(
          `The SIGNAL\nmade it,\nthanks to you!\nTotal:\n${seconds}s`,
          vv2(vp.vpWidth / 2, -10),
          "center",
          15,
          "yellow"
        );

        console.log("thanks!");
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

          const levels = [level01, level02, level03];

          const level = levels[game.level];

          if (!level) {
            return toState("thanks");
          }

          (game as Mutable<typeof game>).levelObjects = level();
        }

        const { target, paddle, ball } = game.levelObjects;

        const keyInputs = useKeyInputs();
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
          // Stash level time now, since ticks are reset on state change.
          const g: Mutable<typeof game> = game;
          g.levelTicks[g.level] = g.ticks;
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

    const { target, paddle, ball, edges } = game.levelObjects;
    if (target && paddle && ball) {
      solveDrag(paddle.int, 0.8);

      accelerate(paddle.int, dt);
      inertia(paddle.int);

      moveAndMaybeBounceBall(ball, paddle, screen, dt);
      if (edges) processEdges(edges, ball);
      moveViewportCamera(paddle.int.cpos as ViewportUnitVector2);
    }

    (game as Mutable<typeof game>).ticks += 1;
  });

  drawStepSystems.push(drawFps);

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

boot();
