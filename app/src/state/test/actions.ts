import actionEmitter from '../utils/common-action-emitter';

// Constants
export const VARIABLE_HERE = 'VARIABLE_HERE';
export type VARIABLE_HERE = typeof VARIABLE_HERE;

// Emitters
export const proactivePlanningStart = actionEmitter(VARIABLE_HERE);


export function stopLoading(text: any) {
  return { type: VARIABLE_HERE, text };
}