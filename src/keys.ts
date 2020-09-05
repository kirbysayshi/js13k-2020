
  // These keys must be quoted to force terser to keep these keys as is. It
  // doesn't know they come from the DOM Keyboard API. Prettier wants to remove

import { Key } from "ts-key-enum";
import { listen } from "./dom";

  // the quotes, so disable it.
  const keyInputs: {
    [K in
      | Extract<Key, Key.ArrowLeft | Key.ArrowRight>
      | "w"
      | "a"
      | "s"
      | "d"]: boolean;
  } = {
    // prettier-ignore
    'w': false,
    // prettier-ignore
    'a': false,
    // prettier-ignore
    's': false,
    // prettier-ignore
    'd': false,
    // prettier-ignore
    'ArrowLeft': false,
    // prettier-ignore
    'ArrowRight': false,
  };

  listen(window, "keydown", (ev) => {
    keyInputs[ev.key as keyof typeof keyInputs] = true;
  });

  listen(window, "keyup", (ev) => {
    keyInputs[ev.key as keyof typeof keyInputs] = false;
  });

  export function useKeyInputs() {
    return keyInputs;
  }