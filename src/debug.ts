// import { DrawStepSystem } from "./components";

// import { toPixelUnits, ViewportUnits } from "./viewport";
// import { dragStateSelector } from "./drag";

// export const debugDrawSystem: DrawStepSystem = (ces, interp) => {
//   const screen = ces.selectFirstData("viewport")!;

//   const points = ces.select(["v-movement"]);
//   const constraints = ces.select(["spring-constraint"]);
//   const pointerTargets = ces.select(["pointer-target"]);
//   const drags = ces.select(dragStateSelector);

//   points.forEach(id => {
//     const data = ces.data(id, "v-movement");
//     const { ctx } = screen.dprCanvas;
//     ctx.beginPath();
//     ctx.fillStyle = "blue";
//     ctx.arc(
//       toPixelUnits((data.ppos.x +
//         (data.cpos.x - data.ppos.x) * interp) as ViewportUnits),
//       toPixelUnits((data.ppos.y +
//         (data.cpos.y - data.ppos.y) * interp) as ViewportUnits),
//       toPixelUnits(1 as ViewportUnits),
//       0,
//       Math.PI * 2
//     );
//     ctx.fill();
//   });

//   constraints.forEach(id => {
//     const data = ces.data(id, "spring-constraint");
//     const v1 = ces.data(data.v1, "v-movement");
//     const v2 = ces.data(data.v2, "v-movement");
//     const { ctx } = screen.dprCanvas;
//     ctx.beginPath();
//     ctx.strokeStyle = "black";
//     ctx.lineWidth = toPixelUnits(0.5 as ViewportUnits);
//     ctx.moveTo(
//       toPixelUnits((v1.ppos.x +
//         (v1.cpos.x - v1.ppos.x) * interp) as ViewportUnits),
//       toPixelUnits((v1.ppos.y +
//         (v1.cpos.y - v1.ppos.y) * interp) as ViewportUnits)
//     );
//     ctx.lineTo(
//       toPixelUnits((v2.ppos.x +
//         (v2.cpos.x - v2.ppos.x) * interp) as ViewportUnits),
//       toPixelUnits((v2.ppos.y +
//         (v2.cpos.y - v2.ppos.y) * interp) as ViewportUnits)
//     );
//     ctx.stroke();
//   });

//   pointerTargets.forEach(id => {
//     const data = ces.data(id, "pointer-target");
//     const { ctx } = screen.dprCanvas;
//     ctx.strokeStyle = "green";
//     ctx.lineWidth = toPixelUnits(0.5 as ViewportUnits);
//     ctx.beginPath();
//     ctx.strokeRect(
//       toPixelUnits((data.box.center.x - data.box.half.x) as ViewportUnits),
//       toPixelUnits((data.box.center.y - data.box.half.y) as ViewportUnits),
//       toPixelUnits((data.box.half.x * 2) as ViewportUnits),
//       toPixelUnits((data.box.half.y * 2) as ViewportUnits)
//     );
//   });

//   drags.forEach(id => {
//     // const drag = ces.data(id, 'drag-state');
//     const data = ces.data(id, "v-movement");
//     const { ctx } = screen.dprCanvas;
//     ctx.beginPath();
//     ctx.fillStyle = "green";
//     ctx.arc(
//       toPixelUnits((data.ppos.x +
//         (data.cpos.x - data.ppos.x) * interp) as ViewportUnits),
//       toPixelUnits((data.ppos.y +
//         (data.cpos.y - data.ppos.y) * interp) as ViewportUnits),
//       toPixelUnits(1 as ViewportUnits),
//       0,
//       Math.PI * 2
//     );
//     ctx.fill();
//   });

//   // entities.forEach(e => {
//   //   // const movement = ces.data(e, "v-movement");
//   //   const circle = ces.data(e, "circle");
//   //   // TODO: this needs to happen through a camera instead of raw pixels
//   //   screen.dprCanvas.ctx.beginPath();
//   //   screen.dprCanvas.ctx.fillStyle = "blue";
//   //   screen.dprCanvas.ctx.arc(
//   //     circle.center.x,
//   //     circle.center.y,
//   //     circle.radius,
//   //     0,
//   //     Math.PI * 2
//   //   );
//   //   screen.dprCanvas.ctx.fill();
//   // });
// };
