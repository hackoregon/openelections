import * as type from '../test/actions';


export const INITIAL_STATE = {
  text: 'initial text',
  isLoading: true,
  error: null
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