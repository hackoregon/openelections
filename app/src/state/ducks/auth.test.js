import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as auth from './auth';
import * as campaigns from './campaigns';
import * as summary from './summary';
import * as governments from './governments';
import * as api from '../../api';
import * as schema from '../../api/schema';

const { actionTypes, actionCreators } = auth;

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
  const reducer = auth.default;
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      me: null,
      isLoading: false,
      error: null,
    });
  });

  it('login', () => {
    expect(
      reducer(undefined, {
        type: actionTypes.LOGIN.REQUEST,
      })
    ).toEqual({
      me: null,
      isLoading: true,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.LOGIN.SUCCESS,
        me: {},
      })
    ).toEqual({
      me: {},
      isLoading: false,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.LOGIN.FAILURE,
        error: '',
      })
    ).toEqual({
      me: null,
      isLoading: false,
      error: '',
    });
  });

  // it("logout", () => {
  //   expect(
  //     reducer(undefined, {
  //       type: actionTypes.LOGIN.SUCCESS,
  //       me: null
  //     })
  //   ).toEqual({
  //     me: null,
  //     isLoading: false,
  //     error: null
  //   });
  // });

  it('me', () => {
    expect(
      reducer(undefined, {
        type: actionTypes.ME.REQUEST,
      })
    ).toEqual({
      me: null,
      isLoading: true,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.ME.SUCCESS,
        me: {},
      })
    ).toEqual({
      me: {},
      isLoading: false,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.ME.FAILURE,
        error: '',
      })
    ).toEqual({
      me: null,
      isLoading: false,
      error: '',
    });
  });

  it('redeem invite', () => {
    expect(
      reducer(undefined, {
        type: actionTypes.REDEEM_INVITE.REQUEST,
      })
    ).toEqual({
      me: null,
      isLoading: true,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.REDEEM_INVITE.SUCCESS,
      })
    ).toEqual({
      me: null,
      isLoading: false,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.REDEEM_INVITE.FAILURE,
        error: '',
      })
    ).toEqual({
      me: null,
      isLoading: false,
      error: '',
    });
  });

  it('reset password', () => {
    expect(
      reducer(undefined, {
        type: actionTypes.RESET_PASSWORD.REQUEST,
      })
    ).toEqual({
      me: null,
      isLoading: true,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.RESET_PASSWORD.SUCCESS,
      })
    ).toEqual({
      me: null,
      isLoading: false,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.RESET_PASSWORD.FAILURE,
        error: '',
      })
    ).toEqual({
      me: null,
      isLoading: false,
      error: '',
    });
  });

  it('send password reset email', () => {
    expect(
      reducer(undefined, {
        type: actionTypes.SEND_PASSWORD_RESET_EMAIL.REQUEST,
      })
    ).toEqual({
      me: null,
      isLoading: true,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.SEND_PASSWORD_RESET_EMAIL.SUCCESS,
      })
    ).toEqual({
      me: null,
      isLoading: false,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.SEND_PASSWORD_RESET_EMAIL.FAILURE,
        error: '',
      })
    ).toEqual({
      me: null,
      isLoading: false,
      error: '',
    });
  });

  it('update password', () => {
    expect(
      reducer(undefined, {
        type: actionTypes.UPDATE_PASSWORD.REQUEST,
      })
    ).toEqual({
      me: null,
      isLoading: true,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.UPDATE_PASSWORD.SUCCESS,
      })
    ).toEqual({
      me: null,
      isLoading: false,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: actionTypes.UPDATE_PASSWORD.FAILURE,
        error: '',
      })
    ).toEqual({
      me: null,
      isLoading: false,
      error: '',
    });
  });
});

describe('Action Creators', () => {
  it('me request', () => {
    const expectedAction = {
      type: actionTypes.ME.REQUEST,
    };
    expect(actionCreators.me.request()).toEqual(expectedAction);
  });

  it('me success', () => {
    const me = {};
    const expectedAction = {
      type: actionTypes.ME.SUCCESS,
      me: {},
    };
    expect(actionCreators.me.success(me)).toEqual(expectedAction);
  });

  it('me failure', () => {
    const error = '';
    const expectedAction = {
      type: actionTypes.ME.FAILURE,
      error: '',
    };
    expect(actionCreators.me.failure(error)).toEqual(expectedAction);
  });

  it('login request', () => {
    const expectedAction = {
      type: actionTypes.LOGIN.REQUEST,
    };
    expect(actionCreators.login.request()).toEqual(expectedAction);
  });

  it('login success', () => {
    const me = {};
    const expectedAction = {
      type: actionTypes.LOGIN.SUCCESS,
      me: {},
    };
    expect(actionCreators.login.success(me)).toEqual(expectedAction);
  });

  it('login failure', () => {
    const error = '';
    const expectedAction = {
      type: actionTypes.LOGIN.FAILURE,
      error: '',
    };
    expect(actionCreators.login.failure(error)).toEqual(expectedAction);
  });

  it('redeem invite request', () => {
    const expectedAction = {
      type: actionTypes.REDEEM_INVITE.REQUEST,
    };
    expect(actionCreators.redeemInvite.request()).toEqual(expectedAction);
  });

  it('redeem invite success', () => {
    const expectedAction = {
      type: actionTypes.REDEEM_INVITE.SUCCESS,
    };
    expect(actionCreators.redeemInvite.success()).toEqual(expectedAction);
  });

  it('redeem invite failure', () => {
    const error = '';
    const expectedAction = {
      type: actionTypes.REDEEM_INVITE.FAILURE,
      error: '',
    };
    expect(actionCreators.redeemInvite.failure(error)).toEqual(expectedAction);
  });

  it('reset password request', () => {
    const expectedAction = {
      type: actionTypes.RESET_PASSWORD.REQUEST,
    };
    expect(actionCreators.resetPassword.request()).toEqual(expectedAction);
  });

  it('reset password success', () => {
    const expectedAction = {
      type: actionTypes.RESET_PASSWORD.SUCCESS,
    };
    expect(actionCreators.resetPassword.success()).toEqual(expectedAction);
  });

  it('reset password failure', () => {
    const error = '';
    const expectedAction = {
      type: actionTypes.RESET_PASSWORD.FAILURE,
      error: '',
    };
    expect(actionCreators.resetPassword.failure(error)).toEqual(expectedAction);
  });

  it('send password reset email request', () => {
    const expectedAction = {
      type: actionTypes.SEND_PASSWORD_RESET_EMAIL.REQUEST,
    };
    expect(actionCreators.sendPasswordResetEmail.request()).toEqual(
      expectedAction
    );
  });

  it('send password reset email success', () => {
    const expectedAction = {
      type: actionTypes.SEND_PASSWORD_RESET_EMAIL.SUCCESS,
    };
    expect(actionCreators.sendPasswordResetEmail.success()).toEqual(
      expectedAction
    );
  });

  it('send password reset email failure', () => {
    const error = '';
    const expectedAction = {
      type: actionTypes.SEND_PASSWORD_RESET_EMAIL.FAILURE,
      error: '',
    };
    expect(actionCreators.sendPasswordResetEmail.failure(error)).toEqual(
      expectedAction
    );
  });

  it('update password request', () => {
    const expectedAction = {
      type: actionTypes.UPDATE_PASSWORD.REQUEST,
    };
    expect(actionCreators.updatePassword.request()).toEqual(expectedAction);
  });

  it('update password success', () => {
    const expectedAction = {
      type: actionTypes.UPDATE_PASSWORD.SUCCESS,
    };
    expect(actionCreators.updatePassword.success()).toEqual(expectedAction);
  });

  it('update password failure', () => {
    const error = '';
    const expectedAction = {
      type: actionTypes.UPDATE_PASSWORD.FAILURE,
      error: '',
    };
    expect(actionCreators.updatePassword.failure(error)).toEqual(
      expectedAction
    );
  });
});

describe('Side Effects', () => {
  beforeEach(() => {
    delete process.env.TOKEN;
  });

  it('me', async () => {
    const expectedActions = [
      { type: actionTypes.ME.REQUEST },
      { type: campaigns.actionTypes.SET_CAMPAIGN.SUCCESS, campaignId: 1 },
      { type: governments.actionTypes.SET_GOVERNMENT.SUCCESS, governmentId: 1 },
      { type: summary.actionTypes.GET_SUMMARY.REQUEST },
      { type: actionTypes.ME.SUCCESS },
    ];
    const store = mockStore({});

    const tokenResponse = await api.login(
      'govadmin@openelectionsportland.org',
      'password'
    );
    process.env.TOKEN = tokenResponse.headers
      .get('set-cookie')
      .match(/=([a-zA-Z0-9].+); Path/)[1];

    return store.dispatch(auth.me()).then(() => {
      const actions = store.getActions();
      expect(actions[0]).toEqual(expectedActions[0]);
      expect(actions[1].type).toEqual(expectedActions[1].type);
      expect(actions[2].type).toEqual(expectedActions[2].type);
      expect(actions[3].type).toEqual(expectedActions[3].type);
      expect(actions[4].me).toMatchObject({
        id: expect.any(Number),
        email: expect.any(String),
      });
    });
  });

  it('me no token', () => {
    const expectedActions = [];
    const store = mockStore({});

    return store.dispatch(auth.me()).then(() => {
      const actions = store.getActions();
      expect(actions).toHaveLength(0);
    });
  });

  it('login', () => {
    const expectedActions = [
      { type: actionTypes.LOGIN.REQUEST },
      { type: actionTypes.LOGIN.SUCCESS },
    ];
    const store = mockStore({});

    return store
      .dispatch(auth.login(govAdmin.email, govAdmin.password))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        expect(actions[1].type).toEqual(expectedActions[1].type);
      });
  });

  it('logout', () => {
    const expectedActions = [{ type: actionTypes.ME.SUCCESS, me: null }];
    const store = mockStore({});
    store.dispatch(auth.logout());
    const actions = store.getActions();
    expect(actions[0]).toEqual(expectedActions[0]);
  });

  it('login failure', () => {
    const expectedActions = [
      { type: actionTypes.LOGIN.REQUEST },
      { type: actionTypes.LOGIN.FAILURE },
    ];
    const store = mockStore({});

    return store
      .dispatch(auth.login(govAdmin.email, 'wrongpassword'))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        expect(actions[1].type).toEqual(expectedActions[1].type);
      });
  });

  it('redeem invite', () => {
    const expectedActions = [
      { type: actionTypes.REDEEM_INVITE.REQUEST },
      { type: actionTypes.REDEEM_INVITE.SUCCESS },
    ];
    const store = mockStore({});

    return store
      .dispatch(auth.redeemInvite(invite.code, invite.password))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        expect(actions[1]).toEqual(expectedActions[1]);
      });
  });

  it('redeem invite failure', () => {
    const expectedActions = [
      { type: actionTypes.REDEEM_INVITE.REQUEST },
      { type: actionTypes.REDEEM_INVITE.FAILURE },
    ];
    const store = mockStore({});

    return store
      .dispatch(auth.redeemInvite('wrongcode', invite.password))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        expect(actions[1]).toEqual(expectedActions[1]);
      });
  });

  it('reset password', () => {
    const expectedActions = [
      { type: actionTypes.RESET_PASSWORD.REQUEST },
      { type: actionTypes.RESET_PASSWORD.SUCCESS },
    ];
    const store = mockStore({});

    return store
      .dispatch(auth.resetPassword(reset.code, reset.password))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('reset password failure', () => {
    const expectedActions = [
      { type: actionTypes.RESET_PASSWORD.REQUEST },
      { type: actionTypes.RESET_PASSWORD.FAILURE },
    ];
    const store = mockStore({});

    return store
      .dispatch(auth.resetPassword('wrongcode', reset.password))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('send password reset email', () => {
    const expectedActions = [
      { type: actionTypes.SEND_PASSWORD_RESET_EMAIL.REQUEST },
      { type: actionTypes.SEND_PASSWORD_RESET_EMAIL.SUCCESS },
    ];
    const store = mockStore({});

    return store
      .dispatch(
        auth.sendPasswordResetEmail('campaignstaff@openelectionsportland.org')
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('send password reset email failure', () => {
    const expectedActions = [
      { type: actionTypes.SEND_PASSWORD_RESET_EMAIL.REQUEST },
      { type: actionTypes.SEND_PASSWORD_RESET_EMAIL.FAILURE },
    ];
    const store = mockStore({});

    return store
      .dispatch(
        auth.sendPasswordResetEmail(
          'wrong_campaignstaff@@openelectionsportland.org'
        )
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('update password', async () => {
    const expectedActions = [
      { type: actionTypes.UPDATE_PASSWORD.REQUEST },
      { type: actionTypes.UPDATE_PASSWORD.SUCCESS },
    ];
    const store = mockStore({});

    const tokenResponse = await api.login(
      'govadmin@openelectionsportland.org',
      'password'
    );
    process.env.TOKEN = tokenResponse.headers
      .get('set-cookie')
      .match(/=([a-zA-Z0-9].+); Path/)[1];

    return store
      .dispatch(auth.updatePassword('password', 'newpassword'))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        expect(actions[1]).toEqual(expectedActions[1]);
      });
  });

  it('update password failure', () => {
    const expectedActions = [
      { type: actionTypes.UPDATE_PASSWORD.REQUEST },
      { type: actionTypes.UPDATE_PASSWORD.FAILURE },
    ];
    const store = mockStore({});

    return store
      .dispatch(auth.updatePassword('password', 'newpassword'))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        expect(actions[1].type).toEqual(expectedActions[1].type);
      });
  });
});
