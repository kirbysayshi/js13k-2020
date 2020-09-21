import { AssuredEntityId } from "./ces3";
import {
  MovementCmp,
  makeMovementCmp,
  UpdateStepSystem,
  DrawStepSystem,
} from "./components";
import { useCES } from "./use-ces";
import {
  ViewportUnitVector2,
  vv2,
  toProjectedPixels,
  toPixelUnits,
  ViewportUnits,
} from "./viewport";
import { useRandom } from "./rng";
import { copy, scale, set } from "pocket-physics";
import { angleOf, rotate2d } from "./phys-utils";
import { YellowRGBA } from "./theme";

export type ParticleCmp = {
  k: "particle";
  move: AssuredEntityId<MovementCmp>;
  age: number;
  startAge: number;
  size: ViewportUnits;
};

export function spawnCollisionParticles(
  pos: ViewportUnitVector2,
  similarity: number,
  normal: ViewportUnitVector2
) {
  spawnParticles(
    pos,
    10,
    1000,
    similarity > 0
      ? (normal as ViewportUnitVector2)
      : (rotate2d(vv2(), normal, pos, Math.PI) as ViewportUnitVector2)
  );
}

export function spawnParticles(
  pos: ViewportUnitVector2,
  count: number,
  maxLongevityMs: number,
  normal?: ViewportUnitVector2,
  size = 0.6 as ViewportUnits,
  maxAcel = 1,
  angleRange = Math.PI
) {
  const ces = useCES();
  for (let i = 0; i < count; i++) {
    const move = makeMovementCmp(pos);
    const acelX = maxAcel * useRandom();
    const acelY = maxAcel * useRandom();
    if (normal) {
      const angle = angleOf(normal);
      const max = angle + angleRange / 2;
      const min = angle - angleRange / 2;
      const rand = useRandom();
      const next = min + rand * (max - min);
      set(move.acel, Math.cos(next) * acelX, Math.sin(next) * acelY);
    } else {
      set(move.acel, acelX, acelY);
    }

    const longevity = useRandom() * maxLongevityMs;
    const moveId = ces.entity([move]);
    ces.entity([
      {
        k: "particle",
        move: moveId,
        age: longevity,
        startAge: longevity,
        size,
      },
    ]);
  }
}

export const particleUpdateSystem: UpdateStepSystem = (ces, dt) => {
  const ids = ces.select(["particle"]);
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const data = ces.data(id, "particle");
    data.age -= dt;
    if (data.age <= 0) ces.destroy(id);
  }
};

export const particleDrawSystem: DrawStepSystem = (ces, interp) => {
  // const ids = ces.select(["particle"]);
  const particles = ces.selectData("particle");
  const vp = ces.selectFirstData("viewport")!;
  const { ctx } = vp.dprCanvas;
  ctx.save();
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    if (!particle) continue;
    const move = ces.data(particle.move, "v-movement");
    const opacity = particle.age / particle.startAge;
    ctx.fillStyle = YellowRGBA.replace(",1)", `,${opacity.toFixed(5)})`);
    ctx.fillRect(
      toProjectedPixels(move.cpos.x, "x"),
      toProjectedPixels(move.cpos.y, "y"),
      toPixelUnits(particle.size),
      toPixelUnits(particle.size)
    );
  }
  ctx.restore();
};
