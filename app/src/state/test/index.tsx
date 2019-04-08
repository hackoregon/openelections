import * as type from '../constants/ActionTypes';


export const INITIAL_STATE = {
  text: '',
  isLoading: true,
  error: undefined
}

const reducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case type.VARIABLE_HERE:
      return {
        ...state,
        ...action.newState
      }
    default:
      return state;
  }
}

export default reducer;