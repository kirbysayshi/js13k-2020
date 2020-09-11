import { Paddle } from "./paddle";
import { Ball } from "./ball";
import { LevelTarget } from "./target";
import { Edge } from "./edge";
import { UpdateTimeDelta } from "./components";
import { DirectionalAccelerator } from "./directional-accelerator";
import { LevelDesc } from "./level-objects";

type GameStates = "boot" | "level" | "win" | "nextlevel" | "thanks";

export type GameData = {
  // ticks spent in this state
  readonly ticks: number;
  readonly prev: null | GameStates;
  readonly state: GameStates;
  readonly level: number;
  readonly levelObjects: LevelDesc | null;
  readonly levelTicks: number[];
};

export const game: GameData = {
  ticks: 0,
  prev: null,
  state: "boot",
  level: -1,
  // level: 1, // start at level 3
  levelObjects: null,
  levelTicks: [],
};

export function toState(next: typeof game["state"]) {
  const g: Mutable<typeof game> = game;
  g.prev = g.state;
  g.state = next;
  g.ticks = 0;
}

export function ticksAsSeconds(ticks: number): number {
  return ((ticks * UpdateTimeDelta) / 1000);
}

export function formatSeconds(s: number) {
  return s.toFixed(3);
}