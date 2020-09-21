import { DrawStepSystem } from "./components";
import { useCES } from "./use-ces";
import { drawTextLinesInViewport, vv2 } from "./viewport";
import { YellowRGBA, BodyTextLines } from "./theme";
import { useDebugMode } from "./query-string";

// fps entity
const ces = useCES();
const id = ces.entity([{ k: "fps", v: 60 }]);

// Draw the FPS as text on the canvas
export const drawFps: DrawStepSystem = (ces) => {
  if (!useDebugMode()) return;
  const fpsData = ces.selectFirstData("fps")!;
  drawTextLinesInViewport(
    fpsData.v.toFixed(2),
    vv2(100, 0),
    "right",
    BodyTextLines,
    YellowRGBA
  );
};

export function onFPS(fps: number) {
  const data = ces.data(id, "fps");
  data.v = fps;
}
