import * as governments from './governments';

const { actionTypes, actionCreators } = governments;

describe('Reducer', () => {
  const reducer = governments.default;

  it('sets current government', () => {
    expect(
      reducer(
        {
          currentGovernmentId: null,
          isLoading: false,
          error: null,
        },
        {
          type: actionTypes.SET_GOVERNMENT.SUCCESS,
          governmentId: 1,
        }
      )
    ).toEqual({
      currentGovernmentId: 1,
      isLoading: false,
      error: null,
    });
  });
});

describe('Action Creators', () => {
  it('set government success', () => {
    const expectedAction = {
      type: actionTypes.SET_GOVERNMENT.SUCCESS,
      governmentId: 1,
    };
    expect(actionCreators.setGovernment.success(1)).toEqual(expectedAction);
  });
});
