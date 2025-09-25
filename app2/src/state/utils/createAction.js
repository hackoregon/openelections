export default function createAction(stateKey, base) {
  return `openelections/${stateKey}/${base}`;
}
