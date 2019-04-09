import * as type from '../test/actions';


export const INITIAL_STATE = {
  text: 'initial text',
  isLoading: true,
  error: null
}

const reducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case type.VARIABLE_HERE:
      console.log('reducering. . .', {action})
      return {
        ...state,
        text: action.payload
      }
    default:
      return state;
  }
}

export default reducer;