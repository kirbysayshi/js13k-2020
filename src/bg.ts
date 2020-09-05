import { useCES } from "./components";
import { ViewportUnits, toProjectedPixels } from "./viewport";


export function drawBGForCamera() {

  // draw lines every 5 viewport units?
  // given the camera position, "find" lines within the camera bounds

  // TODO: make this a starfield?

  const { camera, dprCanvas: {ctx} } = useCES().selectFirstData('viewport')!;

  const cellWidth = 5 as ViewportUnits;

  const leftmostVertical = Math.floor((camera.target.x - camera.frustrum.x) / cellWidth);
  const rightmostVertical = Math.floor((camera.target.x + camera.frustrum.x) / cellWidth);

  const topmostHorizontal = Math.floor((camera.target.y + camera.frustrum.y) / cellWidth);
  const bottommostHorizontal = Math.floor((camera.target.y - camera.frustrum.y) / cellWidth);
  
  ctx.strokeStyle = 'gray';

  // Draw vertical lines (X)
  for (let i = leftmostVertical; i <= rightmostVertical; i++) {
    const x = toProjectedPixels(i * cellWidth as ViewportUnits, 'x');
    const y0 = toProjectedPixels(camera.target.y + camera.frustrum.y as ViewportUnits, 'y');
    const y1 = toProjectedPixels(camera.target.y - camera.frustrum.y as ViewportUnits, 'y');
    ctx.beginPath();
    ctx.moveTo(x, y0);
    ctx.lineTo(x, y1);
    ctx.stroke();
  }

  // Draw horizontal lines (Y)
  for (let i = bottommostHorizontal; i <= topmostHorizontal; i++) {
    const y = toProjectedPixels(i * cellWidth as ViewportUnits, 'y');
    const x0 = toProjectedPixels(camera.target.x - camera.frustrum.x as ViewportUnits, 'x');
    const x1 = toProjectedPixels(camera.target.x + camera.frustrum.x as ViewportUnits, 'x');
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
  }
}