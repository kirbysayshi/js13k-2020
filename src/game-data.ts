import { Paddle } from "./paddle";
import { Ball } from "./ball";
import { LevelTarget } from "./target";
import { Edge } from "./edge";
import { UpdateTimeDelta } from "./components";
import { DirectionalAccelerator } from "./directional-accelerator";
import { LevelDesc } from "./level-objects";
import { level010 } from "./levels/level010";
import { level02 } from "./levels/level02";
import { level03 } from "./levels/level03";
import { levelKitchenSink } from "./levels/level0kitchensink";
import { ViewportUnitVector2 } from "./viewport";
import { level011 } from "./levels/level011";
import { level012 } from "./levels/level012";
import { level013 } from "./levels/level013";

type GameStates =
  | "boot"
  | "tutorial"
  | "level"
  | "win"
  | "nextlevel"
  | "thanks";

export type GameData = {
  // ticks spent in this state
  readonly ticks: number;
  readonly prev: null | GameStates;
  readonly state: GameStates;
  readonly level: number;
  readonly levelObjects: LevelDesc | null;
  readonly levelTicks: number[];
  readonly levels: (() => LevelDesc)[];

  readonly trackOther: null | { cpos: ViewportUnitVector2 };
  readonly trackOtherFinished: boolean;
  readonly trackOtherRemaining: number;
};

export const game: GameData = {
  ticks: 0,
  prev: null,
  state: "boot",
  level: -1,
  // level: 1, // start at level 3
  levelObjects: null,
  levelTicks: [],

  trackOther: null,
  trackOtherFinished: false,
  trackOtherRemaining: -1,

  levels: [
    // levelKitchenSink,
    // level010,
    // level011,
    // level012,
    // level013,
    level02,
    level03,
  ],
};

export function toState(next: typeof game["state"]) {
  const g: Mutable<typeof game> = game;
  g.prev = g.state;
  g.state = next;
  g.ticks = 0;
}

export function ticksAsSeconds(ticks: number): number {
  return (ticks * UpdateTimeDelta) / 1000;
}

export function formatSeconds(s: number) {
  return s.toFixed(3);
}
