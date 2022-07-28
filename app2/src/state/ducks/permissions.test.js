/* eslint-disable no-unused-vars */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as permissions from './permissions';
import * as api from '../../api';
import * as schema from '../../api/schema';
import { ADD_ENTITIES } from './common';

const { actionTypes, actionCreators } = permissions;

const middlewares = [thunk.withExtraArgument({ api, schema })];
const mockStore = configureMockStore(middlewares);

describe('Reducer', () => {
  const reducer = permissions.default;
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isLoading: false,
      error: null,
    });
  });

  it('adds permissions entities', () => {
    expect(
      reducer(undefined, {
        type: ADD_ENTITIES,
        payload: {
          permissions: {
            '1': {
              userId: 1,
              campaignId: 1,
              governmentId: 1,
              role: 'CAMPAIGN_STAFF',
            },
          },
        },
      })
    ).toEqual({
      '1': {
        userId: 1,
        campaignId: 1,
        governmentId: 1,
        role: 'CAMPAIGN_STAFF',
      },
      isLoading: false,
      error: null,
    });
  });

  it('removes permission entity', () => {
    expect(
      reducer(
        {
          '1': {
            userId: 1,
            campaignId: 1,
            governmentId: 1,
            role: 'CAMPAIGN_STAFF',
          },
          isLoading: false,
          error: null,
        },
        {
          type: actionTypes.REMOVE_PERMISSION.SUCCESS,
          permissionId: 1,
          error: null,
        }
      )
    ).toEqual({
      isLoading: false,
      error: null,
    });
  });
});

describe('Action Creators', () => {
  it('remove permissions success', () => {
    const expectedAction = {
      permissionId: 1,
      type: actionTypes.REMOVE_PERMISSION.SUCCESS,
    };
    expect(actionCreators.removePermission.success(1)).toEqual(expectedAction);
  });
});
