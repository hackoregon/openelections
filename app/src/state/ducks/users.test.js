/* eslint-disable no-unused-vars */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as users from './users';
import * as permissions from './permissions';
import * as api from '../../api';
import * as schema from '../../api/schema';
import { ADD_ENTITIES } from './common';

const { actionTypes, actionCreators } = users;

const middlewares = [thunk.withExtraArgument({ api, schema })];
const mockStore = configureMockStore(middlewares);

const govAdmin = {
  email: 'govadmin@openelectionsportland.org',
  password: 'password',
};

const invite = {
  code: 'inviteme',
  email: 'campaignStaff+1@openelectionsportland.org',
  password: 'password',
};

const reset = {
  code: 'resetme',
  password: 'newpassword',
};

describe('Reducer', () => {
  const reducer = users.default;
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isLoading: false,
      error: null,
    });
  });

  it('invite', () => {
    expect(
      reducer(undefined, {
        type: actionTypes.INVITE_USER.REQUEST,
      })
    ).toEqual({
      isLoading: true,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.INVITE_USER.SUCCESS,
      })
    ).toEqual({
      isLoading: false,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.INVITE_USER.FAILURE,
        error: '',
      })
    ).toEqual({
      isLoading: false,
      error: '',
    });
  });

  it('resend invite', () => {
    expect(
      reducer(undefined, {
        type: actionTypes.RESEND_USER_INVITE.REQUEST,
      })
    ).toEqual({
      isLoading: true,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.RESEND_USER_INVITE.SUCCESS,
      })
    ).toEqual({
      isLoading: false,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.RESEND_USER_INVITE.FAILURE,
        error: '',
      })
    ).toEqual({
      isLoading: false,
      error: '',
    });
  });

  it('adds user entities', () => {
    expect(
      reducer(undefined, {
        type: ADD_ENTITIES,
        payload: {
          users: {
            '1': {},
          },
        },
      })
    ).toEqual({
      '1': {},
      isLoading: false,
      error: null,
    });
  });

  it('removeUser success', () => {
    expect(
      reducer(
        {
          1: {
            firstName: 'Dan',
            lastName: 'Melton',
            email: 'dan@civicsoftwarefoundation.org',
          },
        },
        {
          type: actionTypes.REMOVE_USER.SUCCESS,
          userId: 1,
        }
      )
    ).toEqual({
      isLoading: false,
    });
  });

  it('removeUser fail', () => {
    expect(
      reducer(
        {
          1: {
            firstName: 'Dan',
            lastName: 'Melton',
            email: 'dan@civicsoftwarefoundation.org',
          },
          isLoading: true,
          error: null,
        },
        {
          type: actionTypes.REMOVE_USER.FAILURE,
          error: 'an error',
        }
      )
    ).toEqual({
      1: {
        firstName: 'Dan',
        lastName: 'Melton',
        email: 'dan@civicsoftwarefoundation.org',
      },
      isLoading: false,
      error: 'an error',
    });
  });

  it('removeUser request', () => {
    expect(
      reducer(
        {
          1: {
            firstName: 'Dan',
            lastName: 'Melton',
            email: 'dan@civicsoftwarefoundation.org',
          },
          isLoading: false,
          error: null,
        },
        {
          type: actionTypes.REMOVE_USER.REQUEST,
        }
      )
    ).toEqual({
      1: {
        firstName: 'Dan',
        lastName: 'Melton',
        email: 'dan@civicsoftwarefoundation.org',
      },
      isLoading: true,
      error: null,
    });
  });
});

describe('Action Creators', () => {
  it('invite request', () => {
    const expectedAction = {
      type: actionTypes.INVITE_USER.REQUEST,
    };
    expect(actionCreators.inviteUser.request()).toEqual(expectedAction);
  });
  it('invite success', () => {
    const expectedAction = {
      type: actionTypes.INVITE_USER.SUCCESS,
    };
    expect(actionCreators.inviteUser.success()).toEqual(expectedAction);
  });
  it('invite failure', () => {
    const expectedAction = {
      type: actionTypes.INVITE_USER.FAILURE,
    };
    expect(actionCreators.inviteUser.failure()).toEqual(expectedAction);
  });

  it('resend invite request', () => {
    const expectedAction = {
      type: actionTypes.RESEND_USER_INVITE.REQUEST,
    };
    expect(actionCreators.resendUserInvite.request()).toEqual(expectedAction);
  });
  it('resend invite success', () => {
    const expectedAction = {
      type: actionTypes.RESEND_USER_INVITE.SUCCESS,
    };
    expect(actionCreators.resendUserInvite.success()).toEqual(expectedAction);
  });
  it('resend invite failure', () => {
    const expectedAction = {
      type: actionTypes.RESEND_USER_INVITE.FAILURE,
    };
    expect(actionCreators.resendUserInvite.failure()).toEqual(expectedAction);
  });

  it('get government users request', () => {
    const expectedAction = {
      type: actionTypes.GET_GOVERNMENT_USERS.REQUEST,
    };
    expect(actionCreators.getGovernmentUsers.request()).toEqual(expectedAction);
  });
  it('get government users success', () => {
    const expectedAction = {
      type: actionTypes.GET_GOVERNMENT_USERS.SUCCESS,
    };
    expect(actionCreators.getGovernmentUsers.success()).toEqual(expectedAction);
  });
  it('get government users failure', () => {
    const expectedAction = {
      type: actionTypes.GET_GOVERNMENT_USERS.FAILURE,
    };
    expect(actionCreators.getGovernmentUsers.failure()).toEqual(expectedAction);
  });

  it('get campaign users request', () => {
    const expectedAction = {
      type: actionTypes.GET_CAMPAIGN_USERS.REQUEST,
    };
    expect(actionCreators.getCampaignUsers.request()).toEqual(expectedAction);
  });
  it('get campaign users success', () => {
    const expectedAction = {
      type: actionTypes.GET_CAMPAIGN_USERS.SUCCESS,
    };
    expect(actionCreators.getCampaignUsers.success()).toEqual(expectedAction);
  });
  it('get campaign users failure', () => {
    const expectedAction = {
      type: actionTypes.GET_CAMPAIGN_USERS.FAILURE,
    };
    expect(actionCreators.getCampaignUsers.failure()).toEqual(expectedAction);
  });

  it('removeUser Request', () => {
    const expectedAction = {
      type: actionTypes.REMOVE_USER.REQUEST,
    };
    expect(actionCreators.removeUser.request()).toEqual(expectedAction);
  });

  it('removeUser Success', () => {
    const expectedAction = {
      type: actionTypes.REMOVE_USER.SUCCESS,
      userId: 1,
    };
    expect(actionCreators.removeUser.success(1)).toEqual(expectedAction);
  });

  it('removeUser Failure', () => {
    const expectedAction = {
      type: actionTypes.REMOVE_USER.FAILURE,
      error: 'an error message',
    };
    expect(actionCreators.removeUser.failure('an error message')).toEqual(
      expectedAction
    );
  });
});

let govAdminToken;
let campaignAdminToken;
let campaignStaffToken;
let governmentId;
let campaignId;

describe('Side Effects', () => {
  beforeAll(async () => {
    let tokenResponse = await api.login(
      'govadmin@openelectionsportland.org',
      'password'
    );
    govAdminToken = tokenResponse.headers
      .get('set-cookie')
      .match(/=([a-zA-Z0-9].+); Path/)[1];
    let decodedToken = api.decodeToken(govAdminToken);
    governmentId = decodedToken.permissions[0].governmentId;

    tokenResponse = await api.login(
      'campaignadmin@openelectionsportland.org',
      'password'
    );
    campaignAdminToken = tokenResponse.headers
      .get('set-cookie')
      .match(/=([a-zA-Z0-9].+); Path/)[1];
    decodedToken = api.decodeToken(campaignAdminToken);
    campaignId = decodedToken.permissions[0].campaignId;

    tokenResponse = await api.login(
      'campaignstaff@openelectionsportland.org',
      'password'
    );
    campaignStaffToken = tokenResponse.headers
      .get('set-cookie')
      .match(/=([a-zA-Z0-9].+); Path/)[1];
  });

  beforeEach(() => {
    delete process.env.TOKEN;
  });

  it('invite user to gov', async () => {
    const expectedActions = [
      { type: actionTypes.INVITE_USER.REQUEST },
      { type: actionTypes.INVITE_USER.SUCCESS },
      { type: actionTypes.GET_GOVERNMENT_USERS.REQUEST },
      // { type: '@@redux-flash/FLASH' },
    ];
    const store = mockStore({});

    process.env.TOKEN = govAdminToken;

    return store
      .dispatch(
        users.inviteUser(
          'govadmin1@openelectionsportland.org',
          'Government2',
          'Admin2',
          governmentId
        )
      )
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        expect(actions[1]).toEqual(expectedActions[1]);
        expect(actions[2]).toEqual(expectedActions[2]);
      });
  });

  it('invite user to gov failure', async () => {
    const expectedActions = [
      { type: actionTypes.INVITE_USER.REQUEST },
      { type: actionTypes.INVITE_USER.FAILURE },
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    return store
      .dispatch(
        users.inviteUser(
          'govadmin1@openelectionsportland.org',
          'Government2',
          'Admin2',
          governmentId
        )
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('invite user to campaign', async () => {
    const expectedActions = [
      { type: actionTypes.INVITE_USER.REQUEST },
      { type: actionTypes.INVITE_USER.SUCCESS },
      { type: actionTypes.GET_CAMPAIGN_USERS.REQUEST },
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    return store
      .dispatch(
        users.inviteUser(
          'campaignadmin1@openelectionsportland.org',
          'Government2',
          'Admin2',
          campaignId,
          api.UserRoleEnum.CAMPAIGN_STAFF
        )
      )
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        expect(actions[1]).toEqual(expectedActions[1]);
        expect(actions[2]).toEqual(expectedActions[2]);
      });
  });

  it('invite user to campaign failure', async () => {
    const expectedActions = [
      { type: actionTypes.INVITE_USER.REQUEST },
      { type: actionTypes.INVITE_USER.FAILURE },
    ];
    const store = mockStore({});

    return store
      .dispatch(
        users.inviteUser(
          'campaignadmin1@openelectionsportland.org',
          'Government2',
          'Admin2',
          campaignId,
          api.UserRoleEnum.CAMPAIGN_STAFF
        )
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('remove user failure', async () => {
    const expectedActions = [
      { type: actionTypes.REMOVE_USER.REQUEST },
      { type: actionTypes.REMOVE_USER.FAILURE },
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignStaffToken;
    const token = api.decodeToken(campaignStaffToken);
    return store
      .dispatch(users.removeUser(token.id, token.permissions[0].id))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        expect(actions[1]).toEqual(expectedActions[1]);
      });
  });

  it('remove user success', async () => {
    process.env.TOKEN = govAdminToken;
    const tokenResponse = await api.login(
      'campaignstaff+removeme2@openelectionsportland.org',
      'password'
    );

    const token = tokenResponse.headers
      .get('set-cookie')
      .match(/=([a-zA-Z0-9].+); Path/)[1];

    const user = api.decodeToken(token);

    const permissionId = user.permissions[0].id;

    const expectedActions = [
      { type: actionTypes.REMOVE_USER.REQUEST },
      { type: actionTypes.REMOVE_USER.SUCCESS, userId: user.id },
      { type: permissions.actionTypes.REMOVE_PERMISSION.SUCCESS, permissionId },
    ];
    const store = mockStore({});

    return store.dispatch(users.removeUser(user.id, permissionId)).then(() => {
      const actions = store.getActions();
      expect(actions[0]).toEqual(expectedActions[0]);
      expect(actions[1]).toEqual(expectedActions[1]);
      expect(actions[2]).toEqual(expectedActions[2]);
    });
  });

  it('fails to resend user invite as campaign admin', async () => {
    const expectedActions = [
      { type: actionTypes.RESEND_USER_INVITE.REQUEST },
      { type: actionTypes.RESEND_USER_INVITE.FAILURE },
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    return store.dispatch(users.resendUserInvite(null)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('gets government users', async () => {
    const expectedActions = [
      { type: actionTypes.GET_GOVERNMENT_USERS.REQUEST },
      { type: ADD_ENTITIES },
      { type: actionTypes.GET_GOVERNMENT_USERS.SUCCESS },
    ];
    const store = mockStore({});

    process.env.TOKEN = govAdminToken;

    return store.dispatch(users.getGovernmentUsers(governmentId)).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).toEqual(expectedActions[0].type);
      expect(actions[1].type).toEqual(expectedActions[1].type);
      expect(actions[2].type).toEqual(expectedActions[2].type);
    });
  });

  it('gets campaign users', async () => {
    const expectedActions = [
      { type: actionTypes.GET_CAMPAIGN_USERS.REQUEST },
      { type: ADD_ENTITIES },
      { type: actionTypes.GET_CAMPAIGN_USERS.SUCCESS },
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    return store.dispatch(users.getCampaignUsers(campaignId)).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).toEqual(expectedActions[0].type);
      expect(actions[1].type).toEqual(expectedActions[1].type);
      expect(actions[2].type).toEqual(expectedActions[2].type);
    });
  });
});
