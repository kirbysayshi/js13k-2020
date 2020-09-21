import { UpdateStepSystem } from "./components";
import { accelerate, inertia } from "pocket-physics";

export const updateMovementSystem: UpdateStepSystem = (ces, dt) => {
  const datas = ces.selectData("v-movement");
  for (let i = 0; i < datas.length; i++) {
    const data = datas[i];
    if (!data) continue;
    accelerate(data, dt);
    // TODO: might need to separate this into two steps to account for collisions.
    inertia(data);
  }
};
