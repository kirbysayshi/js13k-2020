import { YellowRGBA, BlackRGBA, BodyTextLines, BodyTextFont } from "./theme";
import { useCES } from "./components";
import {
  predictTextHeight,
  ViewportUnits,
  toPixelUnits,
  vv2,
} from "./viewport";
import { listen, qsel, createTap } from "./dom";
import { v2, Vector2 } from "pocket-physics";

const cssYellowRGBA = "--yellowRGBA" as const;
const cssBlackRGBA = "--blackRGBA" as const;
const cssBodyFontSize = "--bodyFontSize" as const;
const cssCtrlPanelHeight = "--ctrlPanelHeight" as const;
const cssCtrlPanelTop = "--ctrlPanelTop" as const;

type CssYellowRGBA = typeof cssYellowRGBA;
type CssBlackRGBA = typeof cssBlackRGBA;
type CssBodyFontSize = typeof cssBodyFontSize;
type CssCtrlPanelHeight = typeof cssCtrlPanelHeight;
type CssCtrlPanelTop = typeof cssCtrlPanelTop;

export function syncCss() {
  const cameraHalfHeight = useCES().selectFirstData("viewport")!.camera.frustrum
    .y;
  const cameraHalfHeightCssPixels = toPixelUnits(cameraHalfHeight);
  const cameraHeightCssPixels = cameraHalfHeightCssPixels * 2;
  const { fontSize } = predictTextHeight("M", BodyTextLines, BodyTextFont);

  setRootVar(cssYellowRGBA, YellowRGBA);
  setRootVar(cssBlackRGBA, BlackRGBA);
  setRootVar(cssBodyFontSize, fontSize);
  setRootVar(cssCtrlPanelHeight, `${cameraHalfHeightCssPixels}px`);
  setRootVar(cssCtrlPanelTop, `${cameraHeightCssPixels}px`);
}

function setRootVar(
  v:
    | CssYellowRGBA
    | CssBlackRGBA
    | CssBodyFontSize
    | CssCtrlPanelHeight
    | CssCtrlPanelTop,
  value: string
) {
  const root = qsel<HTMLHtmlElement>(":root")!;
  root.style.setProperty(v, value);
}

const internalState = {
  onReset: () => {},
  unwire: () => {},
};

const uiState = {
  boosting: false,
  move: v2(),
  rotate: vv2(),
};

export function getUIState() {
  return uiState as Readonly<typeof uiState>;
}

export function setOnReset(cb: () => void) {
  internalState.onReset = cb;
}

export function wireUI() {
  const btnBoost = qsel<HTMLButtonElement>("#btn-boost")!;
  const btnReset = qsel<HTMLButtonElement>("#btn-reset")!;

  const stickMove = qsel<HTMLDivElement>("#stick-move")!;
  const stickMoveNub = qsel<HTMLDivElement>("#stick-move .ui-nub")!;
  const stickRotate = qsel<HTMLDivElement>("#stick-rotate")!;
  const stickRotateNub = qsel<HTMLDivElement>("#stick-rotate .ui-nub")!;

  const unwireStick1 = wireStick(stickMove, stickMoveNub, uiState.move);
  const unwireStick2 = wireStick(stickRotate, stickRotateNub, uiState.rotate);

  const unres = createTap(btnReset, () => {
    internalState.onReset();
  });

  const unmd = listen(btnBoost, "mousedown", () => {
    uiState.boosting = true;
  });

  const unmu = listen(btnBoost, "mouseup", () => {
    uiState.boosting = false;
  });

  const unts = listen(btnBoost, "touchstart", () => {
    uiState.boosting = true;
  });

  const unte = listen(btnBoost, "touchend", () => {
    uiState.boosting = false;
  });

  const unwire = () => {
    unmd();
    unmu();
    unts();
    unte();

    unres();

    unwireStick1();
    unwireStick2();
  };

  internalState.unwire = unwire;
}

export function unwireUI() {
  internalState.unwire();
}

function wireStick(
  stick: HTMLDivElement,
  nub: HTMLDivElement,
  out_Move: Vector2
) {
  const stickCenter = v2();
  const stickSize = v2();

  const unts = listen(stick, "touchstart", (ev) => {
    ev.preventDefault();
    const touch = ev.targetTouches[0];
    stickCenter.x = touch.screenX;
    stickCenter.y = touch.screenY;

    const rect = stick.getBoundingClientRect();
    stickSize.x = rect.width;
    stickSize.y = rect.height;
  });

  const untm = listen(stick, "touchmove", (ev) => {
    ev.preventDefault();
    const touch = ev.targetTouches[0];
    const deltaX = touch.screenX - stickCenter.x;
    const deltaY = (touch.screenY - stickCenter.y) * -1;

    // Normalize distance to a percentage
    out_Move.x = deltaX / (stickSize.x / 2);
    out_Move.y = deltaY / (stickSize.y / 2);

    applyToStickDom(out_Move, nub);
  });

  const unte = listen(stick, "touchend", (ev) => {
    ev.preventDefault();
    stickCenter.x = stickCenter.y = 0;
    stickSize.x = stickSize.y = 0;
    out_Move.x = out_Move.y = 0;
    applyToStickDom(out_Move, nub);
  });

  function applyToStickDom(move: Vector2, nub: HTMLDivElement) {
    const cssLeftPct = ((move.x + 1) / 2) * 100;
    const cssTopPct = -((move.y - 1) / 2) * 100;

    const clampedCssLeftPct = Math.max(Math.min(cssLeftPct, 100), 0);
    const clampedCssTopPct = Math.max(Math.min(cssTopPct, 100), 0);

    nub.style.setProperty("--leftPct", `${clampedCssLeftPct}%`);
    nub.style.setProperty("--topPct", `${clampedCssTopPct}%`);
  }

  return () => {
    unts();
    untm();
    unte();
  };
}
