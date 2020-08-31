import {
  Integratable,
  sub,
  v2,
  normalize,
  scale,
  Vector2,
  add,
  set
} from "pocket-physics";

export function setVelocity(cmp: Integratable, mag: number) {
  const dir = sub(v2(), cmp.cpos, cmp.ppos);
  const norm = normalize(dir, dir);
  const vel = scale(norm, norm, mag);
  sub(cmp.ppos, cmp.cpos, vel);
}

// Taken nearly verbatim from gl-matrix
export function rotate2d<V extends Vector2>(
  out: V,
  target: V,
  origin: V,
  rad: number
) {
  //Translate point to the origin
  const p0 = target.x - origin.x;
  const p1 = target.y - origin.y;
  const sinC = Math.sin(rad);
  const cosC = Math.cos(rad);

  //perform rotation and translate to correct position
  out.x = p0 * cosC - p1 * sinC + origin.x;
  out.y = p0 * sinC + p1 * cosC + origin.y;

  return out;
}
