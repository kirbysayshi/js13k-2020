import {
  Integratable,
  sub,
  v2,
  normalize,
  scale,
  Vector2,
  add,
  set,
  PointEdgeProjection
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

export function makePointEdgeProjectionResult(): PointEdgeProjection {
  return { distance: 0, similarity: 0, u: 0, projectedPoint: v2(), edgeNormal: v2() }
}

export function vd(v: Vector2) {
  return `(${v.x}, ${v.y})`;
}


// preallocations
const v = v2();
const direction = v2();
const radiusSegment = v2();

// Compute the leading edge of a circular moving object given a radius: cpos +
// radius in the direction of velocity.
export function projectCposWithRadius(out: Vector2, p: Integratable, radius: number) {
  sub(v, p.cpos, p.ppos);
  normalize(direction, v);
  scale(radiusSegment, direction, radius);
  add(out, radiusSegment, p.cpos);
  return out;
}


export function angleOf(v: Vector2) {
  return Math.atan2(v.y, v.x);
}