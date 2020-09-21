import { UpdateTimeDelta } from "./components";
import { LevelDesc } from "./level-objects";
import { level010 } from "./levels/level010";
import { level020 } from "./levels/level020";
import { level030 } from "./levels/level030";
import { levelKitchenSink } from "./levels/level0kitchensink";
import { ViewportUnitVector2 } from "./viewport";
import { level011 } from "./levels/level011";
import { level012 } from "./levels/level012";
import { level013 } from "./levels/level013";
import { level031 } from "./levels/level031";
import { level032 } from "./levels/level032";
import { level040 } from "./levels/level040";
import { level050 } from "./levels/level050";

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

  // Whether to track another object with the camera temporarily. To stop, set
  // trackOtherFinished to true and allow a tick.
  readonly trackOther: null | {
    cpos: ViewportUnitVector2;
    ppos: ViewportUnitVector2;
  };
  readonly trackOtherFinished: boolean;
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

  levels: [
    // levelKitchenSink,

    level010,
    level011,
    level012,
    level013,

    level020,

    level030,
    level031,
    level032,

    level040,

    level050,
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

export function trackOther(other: {
  cpos: ViewportUnitVector2;
  ppos: ViewportUnitVector2;
}) {
  const g: Mutable<typeof game> = game;
  g.trackOther = other;
  g.trackOtherFinished = false;
}

export function markTrackingFinished() {
  const g: Mutable<typeof game> = game;
  g.trackOtherFinished = true;
}

export function resetTracking() {
  const g: Mutable<typeof game> = game;
  g.trackOther = null;
  g.trackOtherFinished = false;
}
