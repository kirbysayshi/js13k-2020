import { UpdateStepSystem } from "./components";
import { accelerate, inertia } from "pocket-physics";

export const updateMovementSystem: UpdateStepSystem = (ces, dt) => {
  const ids = ces.select(["v-movement"]);
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const data = ces.data(id, "v-movement");
    accelerate(data, dt);
    // TODO: might need to separate this into two steps to account for collisions.
    inertia(data);
  }
};
