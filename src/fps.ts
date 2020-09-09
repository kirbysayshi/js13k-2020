import { useCES, DrawStepSystem } from "./components";
import { drawTextLinesInViewport, vv2 } from "./viewport";

// fps entity
const ces = useCES();
const id = ces.entity([{ k: "fps", v: 60 }]);

// Draw the FPS as text on the canvas
export const drawFps: DrawStepSystem = (ces) => {
  const fpsData = ces.selectFirstData("fps")!;
  drawTextLinesInViewport(
    fpsData.v.toFixed(2),
    vv2(100, 0),
    "right",
    44,
    "rgba(255,255,132,1)"
  );
};

export function onFPS(fps: number) {
  const data = ces.data(id, "fps");
  data.v = fps;
}
