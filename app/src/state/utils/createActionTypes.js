const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";

export default function createActionTypes(stateKey, base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `openelections/${stateKey}/${base}_${type}`;
    return acc;
  }, {});
}
