import actionEmitter from "../utils/common-action-emitter";

// Constants
export const VARIABLE_HERE = "VARIABLE_HERE";

// Emitters
export const testEmitter = actionEmitter(VARIABLE_HERE);

export function stopLoading(text) {
  return { type: VARIABLE_HERE, text };
}
