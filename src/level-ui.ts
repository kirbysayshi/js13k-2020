import { useCES, UpdateTimeDelta } from "./components";
import { drawTextLines, vv2 } from "./viewport";
import { GameData } from "./game-data";

export function drawLevelUI(game: GameData, interp: number) {
  const vp = useCES().selectFirstData("viewport")!;

  const time = ((game.ticks * UpdateTimeDelta) / 1000).toFixed(3);
  drawTextLines(time, vv2(vp.vpWidth / 2, 0), "center", 44, "yellow");

  drawTextLines(`Level ${game.level} of ??`, vv2(0, 0), "left", 44, "yellow");
}
