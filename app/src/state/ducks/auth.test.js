import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as auth from "./auth";

const { actionTypes, actionCreators } = auth;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const govAdmin = {
  email: "govadmin@openelectionsportland.org",
  password: "password"
};

describe("Action Creators", () => {
  it("login request", () => {
    const expectedAction = {
      type: actionTypes.LOGIN_REQUEST
    };
    expect(actionCreators.setLoginRequest()).toEqual(expectedAction);
  });

  it("login success", () => {
    const me = {};
    const expectedAction = {
      type: actionTypes.LOGIN_SUCCESS,
      me: {}
    };
    expect(actionCreators.setLoginSuccess(me)).toEqual(expectedAction);
  });

  it("login failure", () => {
    const error = "";
    const expectedAction = {
      type: actionTypes.LOGIN_FAILURE,
      error: ""
    };
    expect(actionCreators.setLoginFailure(error)).toEqual(expectedAction);
  });
});

describe("Side Effects", () => {
  it("login", () => {
    const expectedActions = [
      { type: actionTypes.LOGIN_REQUEST },
      { type: actionTypes.LOGIN_SUCCESS }
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
      { type: actionTypes.LOGIN_REQUEST },
      { type: actionTypes.LOGIN_FAILURE }
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
});
