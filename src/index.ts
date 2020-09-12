import { accelerate, inertia, solveDrag } from "pocket-physics";
import ScienceHalt from "science-halt";
import { loadAssets } from "./asset-map";
import { drawBall, moveAndMaybeBounceBall } from "./ball";
import { drawStarfield, drawBlackBG } from "./bg";
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
import { Loop } from "./loop";
import {
  drawPaddle,
  movePaddle,
  rotatePaddleLeft,
  rotatePaddleRight,
} from "./paddle";
import { rotate2d } from "./phys-utils";
import { drawLevelTarget, testWinCondition } from "./target";
import { schedule, tick, reset } from "./time";
import {
  clearScreen,
  computeWindowResize,
  drawTextLinesInViewport,
  moveViewportCamera,
  ViewportUnitVector2,
  vv2,
  fillBeyondCamera,
  drawTextLinesInWorld,
  ViewportUnits,
} from "./viewport";
import { drawFps, onFPS } from "./fps";
import {
  maybeCollideWithAccelerators,
  drawAccelerators,
} from "./directional-accelerator";
import {
  YellowRGBA,
  TitleTextLines,
  BodyTextLines,
  TitleTextFont,
  Transparent,
} from "./theme";
import { LevelDesc } from "./level-objects";
import { listen } from "./dom";

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
        drawStarfield();

        let y = 10;

        y -= drawTextLinesInWorld(
          "SIGNAL DECAY",
          vv2(0, y),
          "center",
          TitleTextLines,
          YellowRGBA,
          Transparent,
          TitleTextFont
        );

        y -= 5;
        drawTextLinesInWorld(
          "a js13k entry by\nDrew Petersen",
          vv2(0, y),
          "center",
          BodyTextLines,
          YellowRGBA
        );

        y -= 20;
        drawTextLinesInWorld(
          "TAP OR CLICK TO START",
          vv2(0, y),
          "center",
          BodyTextLines,
          YellowRGBA,
          Transparent,
          TitleTextFont
        );

        break;
      }

      case "tutorial": {
        drawBlackBG();

        let y = 50;
        const x = -45;

        y -= 5;
        y -= drawTextLinesInWorld(
          [
            "Be the best signalmancer in the galaxy!",
            "",
            "Help messages from deep space colonies bounce their",
            "way to their targets as quickly as possible.",
          ].join("\n"),
          vv2(x, y),
          "left",
          BodyTextLines,
          YellowRGBA
        );

        y -= 5;
        y -= drawTextLinesInWorld(
          "CONTROLS (KEYBOARD)",
          vv2(x, y),
          "left",
          BodyTextLines,
          YellowRGBA,
          Transparent,
          TitleTextFont
        );

        y -= 5;
        y -= drawTextLinesInWorld(
          [
            "WASD:  move",
            "Hold any SHIFT to boost",
            "",
            "Arrow Left / Arrow Right: rotate the Deflector",
          ].join("\n"),
          vv2(x, y),
          "left",
          BodyTextLines,
          YellowRGBA
        );

        y -= 5;
        y -= drawTextLinesInWorld(
          "CONTROLS (TOUCH)",
          vv2(x, y),
          "left",
          BodyTextLines,
          YellowRGBA,
          Transparent,
          TitleTextFont
        );

        y -= 5;
        y -= drawTextLinesInWorld(
          [
            "Left Stick:  move",
            "Move stick and hold BOOST to boost",
            "",
            "Right Stick: rotate the Deflector",
          ].join("\n"),
          vv2(x, y),
          "left",
          BodyTextLines,
          YellowRGBA
        );

        y -= 5;
        y -= drawTextLinesInWorld(
          "TAP OR CLICK TO CONTINUE",
          vv2(0, y),
          "center",
          BodyTextLines,
          YellowRGBA,
          Transparent,
          TitleTextFont
        );

        break;
      }

      case "level": {
        if (!game.levelObjects) break;
        const { target, paddle, ball, edges, das } = game.levelObjects;
        drawStarfield();
        drawLevelTarget(target, interp);
        drawPaddle(paddle);
        drawBall(ball, interp);
        drawAccelerators(das);
        drawEdges(edges);
        drawLevelUI(game, interp);
        break;
      }

      case "win": {
        drawBlackBG();

        const vp = ces.selectFirstData("viewport")!;
        const levelTime = formatSeconds(
          ticksAsSeconds(game.levelTicks[game.level])
        );
        drawTextLinesInViewport(
          `Mission\nCompleted!\n${levelTime}s`,
          vv2(vp.vpWidth / 2, -10),
          "center",
          15,
          YellowRGBA
        );
        break;
      }

      case "nextlevel": {
        break;
      }

      case "thanks": {
        drawBlackBG();

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
          YellowRGBA
        );

        console.log("thanks!");
        break;
      }

      default: {
        const _n: never = game.state;
      }
    }

    fillBeyondCamera();
  });

  updateStepSystems.push((ces, dt) => {
    switch (game.state) {
      case "boot": {
        if (game.ticks === 0) {
          const vp = ces.selectFirstData("viewport")!;
          const unlisten = listen(vp.dprCanvas.cvs, "click", () => {
            unlisten();
            reset();
            toState("tutorial");
          });
        }

        break;
      }
      case "tutorial": {
        if (game.ticks === 0) {
          const vp = ces.selectFirstData("viewport")!;
          const unlisten = listen(vp.dprCanvas.cvs, "click", () => {
            unlisten();
            reset();
            toState("nextlevel");
          });
        }

        break;
      }
      case "level": {
        if (game.ticks === 0) {
          // initialize on first tick

          const level = game.levels[game.level];
          if (!level) {
            return toState("thanks");
          }
          (game as Mutable<typeof game>).levelObjects = level();
        }

        if (!game.levelObjects) break;

        const { target, paddle, ball } = game.levelObjects;

        const keyInputs = useKeyInputs();
        if (keyInputs.ArrowLeft) rotatePaddleLeft(paddle!);
        if (keyInputs.ArrowRight) rotatePaddleRight(paddle!);

        // Shift is a boost
        const paddleAcel =
          keyInputs.ShiftLeft || keyInputs.ShiftRight ? vv2(1, 0) : vv2(0.2, 0);
        const origin = vv2();
        let angle = 0;
        if (keyInputs.KeyW && keyInputs.KeyD) angle = Math.PI / 4;
        else if (keyInputs.KeyW && keyInputs.KeyA) angle = Math.PI * (3 / 4);
        else if (keyInputs.KeyS && keyInputs.KeyD) angle = -Math.PI / 4;
        else if (keyInputs.KeyS && keyInputs.KeyA) angle = -Math.PI * (3 / 4);
        else if (keyInputs.KeyW) angle = Math.PI / 2;
        else if (keyInputs.KeyA) angle = Math.PI;
        else if (keyInputs.KeyS) angle = -Math.PI / 2;
        else if (keyInputs.KeyD) angle = 0;
        if (angle !== 0 || keyInputs.KeyD)
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
          }, 1000);
        }
        break;
      }

      case "nextlevel": {
        const g: Mutable<typeof game> = game;
        g.level += 1;
        g.levelObjects = null;
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

    if (!game.levelObjects) return;

    // General level updates??? Systems???

    const { target, paddle, ball, edges, das } = game.levelObjects;
    if (target && paddle && ball) {
      solveDrag(paddle.int, 0.8);
      accelerate(paddle.int, dt);
      moveAndMaybeBounceBall(ball, paddle, screen, dt);
      maybeCollideWithAccelerators(ball, das);
      processEdges(edges, ball);
      inertia(paddle.int);
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
