import { ViewportCmp, ViewportUnitVector2, vv2 } from "./viewport";
// import { PointerTargetCmp, DragStateCmp } from "./drag.ts.disabled";
import { AssuredEntityId, NarrowComponent, CES3 } from "./ces3";
import { copy } from "pocket-physics";
import { ParticleCmp } from "./particles";

export type FPSCmp = {
  k: "fps";
  v: number;
};

export type MovementCmp = {
  k: "v-movement";
  cpos: ViewportUnitVector2;
  ppos: ViewportUnitVector2;
  acel: ViewportUnitVector2;
};

export function makeMovementCmp(pos: ViewportUnitVector2): MovementCmp {
  return {
    k: "v-movement",
    cpos: copy(vv2(), pos) as ViewportUnitVector2,
    ppos: copy(vv2(), pos) as ViewportUnitVector2,
    acel: vv2(),
  };
}

export type Component =
  | FPSCmp
  // | DragStateCmp
  // | PointerTargetCmp
  | ViewportCmp
  | MovementCmp
  | ParticleCmp;

// Mapped types are bonkers! The syntax... Without the second
// `extends Component` it would not allow indexing by `"k"`.
export type EntityDefSelector<T extends [Component] | Component[]> = Readonly<
  { [K in keyof T]: T[K] extends Component ? T[K]["k"] : never }
>;

// Given a list of Components, return a Compatible AssuredEntityId. This allows
// a "Def" (what is passed to EntityDefSelector) to create matching
// AssuredEntityIds.
export type DefToAssuredEntityId<T extends Component[]> = AssuredEntityId<
  NarrowComponent<Component, T[number]["k"]>
>;

// Allow type inference of K to narrow an assured entity. Without this,
// const id: AssuredEntityId<C> = AssuredEntityId<A | B | C> will fail
// const id: AssuredEntityId<C> = narrowAssuredEntity(AssuredEntityId<A | B | C>) is good!
export function narrowAssuredEntity<
  T extends Component,
  K extends AssuredEntityId<T>
>(id: AssuredEntityId<T>) {
  return id as K;
}

export const DrawTimeHz = 60 as const;
export const UpdateTimeHz = 30 as const;
export const DrawTimeDelta = 16.6666666 as const; // 1000 / DrawTimeHz;
export const UpdateTimeDelta = 33.3333333 as const; // 1000 / UpdateTimeHz;

// A system of an entity-component-system framework is simply a function that
// is repeatedly called. We separate them into two types based on how often
// they are invoked: every frame or once every update step (10fps by default).
export type DrawStepSystem = (ces: CES3<Component>, interp: number) => void;
export type UpdateStepSystem = (ces: CES3<Component>, dt: number) => void;
