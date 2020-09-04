import { Paddle } from "./paddle";
import { Ball } from "./ball";
import { LevelTarget } from "./target";

type GameStates = "boot" | "level" | "win" | "nextlevel" | "thanks";

export type GameData = {
  // ticks spent in this state
  readonly ticks: number;
  readonly prev: null | GameStates;
  readonly state: GameStates;
  readonly level: number;
  readonly levelObjects: {
    paddle: Paddle | null;
    ball: Ball | null;
    target: LevelTarget | null;
  };
};

export const game: GameData = {
  ticks: 0,
  prev: null,
  state: "boot",
  level: -1,
  levelObjects: {
    paddle: null,
    ball: null,
    target: null,
  },
};

export function toState(next: typeof game["state"]) {
  const g: Mutable<typeof game> = game;
  g.prev = g.state;
  g.state = next;
  g.ticks = 0;
}
