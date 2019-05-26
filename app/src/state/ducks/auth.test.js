import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as auth from "./auth";
import * as api from "../../api";

const { actionTypes, actionCreators } = auth;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const govAdmin = {
  email: "govadmin@openelectionsportland.org",
  password: "password"
};

const invite = {
  code: "inviteme",
  email: "campaignStaff+1@openelectionsportland.org",
  password: "password"
};

describe("Reducer", () => {
  const reducer = auth.default;
  it("initial state", () => {
    expect(reducer(undefined, {})).toEqual({
      me: null,
      isLoading: false,
      error: null
    });
  });

  it("login", () => {
    expect(
      reducer(undefined, {
        type: actionTypes.LOGIN.REQUEST
      })
    ).toEqual({
      me: null,
      isLoading: true,
      error: null
    });

    expect(
      reducer(undefined, {
        type: actionTypes.LOGIN.SUCCESS,
        me: {}
      })
    ).toEqual({
      me: {},
      isLoading: false,
      error: null
    });

    expect(
      reducer(undefined, {
        type: actionTypes.LOGIN.FAILURE,
        error: ""
      })
    ).toEqual({
      me: null,
      isLoading: false,
      error: ""
    });
  });

  it("me", () => {
    expect(
      reducer(undefined, {
        type: actionTypes.ME.REQUEST
      })
    ).toEqual({
      me: null,
      isLoading: true,
      error: null
    });

    expect(
      reducer(undefined, {
        type: actionTypes.ME.SUCCESS,
        me: {}
      })
    ).toEqual({
      me: {},
      isLoading: false,
      error: null
    });

    expect(
      reducer(undefined, {
        type: actionTypes.ME.FAILURE,
        error: ""
      })
    ).toEqual({
      me: null,
      isLoading: false,
      error: ""
    });
  });

  it("redeem invite", () => {
    expect(
      reducer(undefined, {
        type: actionTypes.REDEEM_INVITE.REQUEST
      })
    ).toEqual({
      me: null,
      isLoading: true,
      error: null
    });

    expect(
      reducer(undefined, {
        type: actionTypes.REDEEM_INVITE.SUCCESS
      })
    ).toEqual({
      me: null,
      isLoading: false,
      error: null
    });

    expect(
      reducer(undefined, {
        type: actionTypes.REDEEM_INVITE.FAILURE,
        error: ""
      })
    ).toEqual({
      me: null,
      isLoading: false,
      error: ""
    });
  });
});

describe("Action Creators", () => {
  it("me request", () => {
    const expectedAction = {
      type: actionTypes.ME.REQUEST
    };
    expect(actionCreators.me.request()).toEqual(expectedAction);
  });

  it("me success", () => {
    const me = {};
    const expectedAction = {
      type: actionTypes.ME.SUCCESS,
      me: {}
    };
    expect(actionCreators.me.success(me)).toEqual(expectedAction);
  });

  it("me failure", () => {
    const error = "";
    const expectedAction = {
      type: actionTypes.ME.FAILURE,
      error: ""
    };
    expect(actionCreators.me.failure(error)).toEqual(expectedAction);
  });

  it("login request", () => {
    const expectedAction = {
      type: actionTypes.LOGIN.REQUEST
    };
    expect(actionCreators.login.request()).toEqual(expectedAction);
  });

  it("login success", () => {
    const me = {};
    const expectedAction = {
      type: actionTypes.LOGIN.SUCCESS,
      me: {}
    };
    expect(actionCreators.login.success(me)).toEqual(expectedAction);
  });

  it("login failure", () => {
    const error = "";
    const expectedAction = {
      type: actionTypes.LOGIN.FAILURE,
      error: ""
    };
    expect(actionCreators.login.failure(error)).toEqual(expectedAction);
  });

  it("redeem invite request", () => {
    const expectedAction = {
      type: actionTypes.REDEEM_INVITE.REQUEST
    };
    expect(actionCreators.redeemInvite.request()).toEqual(expectedAction);
  });

  it("redeem invite success", () => {
    const me = {};
    const expectedAction = {
      type: actionTypes.REDEEM_INVITE.SUCCESS,
      me: {}
    };
    expect(actionCreators.redeemInvite.success(me)).toEqual(expectedAction);
  });

  it("redeem invite failure", () => {
    const error = "";
    const expectedAction = {
      type: actionTypes.REDEEM_INVITE.FAILURE,
      error: ""
    };
    expect(actionCreators.redeemInvite.failure(error)).toEqual(expectedAction);
  });
});

describe("Side Effects", () => {
  beforeEach(() => {
    delete process.env.TOKEN;
  });

  it("me", async () => {
    const expectedActions = [
      { type: actionTypes.ME.REQUEST },
      { type: actionTypes.ME.SUCCESS }
    ];
    const store = mockStore({});

    const tokenResponse = await api.login(
      "govadmin@openelectionsportland.org",
      "password"
    );
    process.env.TOKEN = tokenResponse.headers
      .get("set-cookie")
      .match(/=([a-zA-Z0-9].+); Path/)[1];

    return store.dispatch(auth.me()).then(() => {
      const actions = store.getActions();
      expect(actions[0]).toEqual(expectedActions[0]);
      expect(actions[1].type).toEqual(expectedActions[1].type);
      expect(actions[1].me).toMatchObject({
        id: expect.any(Number),
        email: expect.any(String)
      });
    });
  });

  it("me failure", () => {
    const expectedActions = [
      { type: actionTypes.ME.REQUEST },
      { type: actionTypes.ME.FAILURE }
    ];
    const store = mockStore({});

    return store.dispatch(auth.me()).then(() => {
      const actions = store.getActions();
      expect(actions[0]).toEqual(expectedActions[0]);
      expect(actions[1].type).toEqual(expectedActions[1].type);
    });
  });

  it("login", () => {
    const expectedActions = [
      { type: actionTypes.LOGIN.REQUEST },
      { type: actionTypes.LOGIN.SUCCESS }
    ];
    const store = mockStore({});

    return store
      .dispatch(auth.login(govAdmin.email, govAdmin.password))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        expect(actions[1].type).toEqual(expectedActions[1].type);
        expect(actions[1].me).toMatchObject({
          id: expect.any(Number),
          email: expect.any(String)
        });
      });
  });

  it("login failure", () => {
    const expectedActions = [
      { type: actionTypes.LOGIN.REQUEST },
      { type: actionTypes.LOGIN.FAILURE }
    ];
    const store = mockStore({});

    return store
      .dispatch(auth.login(govAdmin.email, "wrongpassword"))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        expect(actions[1].type).toEqual(expectedActions[1].type);
      });
  });

  it("redeem invite", () => {
    const expectedActions = [
      { type: actionTypes.REDEEM_INVITE.REQUEST },
      { type: actionTypes.REDEEM_INVITE.SUCCESS }
    ];
    const store = mockStore({});

    return store
      .dispatch(auth.redeemInvite(invite.code, invite.password))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("redeem invite failure", () => {
    const expectedActions = [
      { type: actionTypes.REDEEM_INVITE.REQUEST },
      { type: actionTypes.REDEEM_INVITE.FAILURE }
    ];
    const store = mockStore({});

    return store
      .dispatch(auth.redeemInvite("wrongcode", invite.password))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
