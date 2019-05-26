import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as users from "./users";
import * as api from "../../api";
import { UserRoleEnum } from "../../api";

const { actionTypes, actionCreators } = users;

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

const reset = {
  code: "resetme",
  password: "newpassword"
};

describe("Reducer", () => {
  const reducer = users.default;
  it("initial state", () => {
    expect(reducer(undefined, {})).toEqual({
      users: null,
      isLoading: false,
      error: null
    });
  });

  it("invite", () => {
    expect(
      reducer(undefined, {
        type: actionTypes.INVITE_USER.REQUEST
      })
    ).toEqual({
      users: null,
      isLoading: true,
      error: null
    });

    expect(
      reducer(undefined, {
        type: actionTypes.INVITE_USER.SUCCESS
      })
    ).toEqual({
      users: null,
      isLoading: false,
      error: null
    });

    expect(
      reducer(undefined, {
        type: actionTypes.INVITE_USER.FAILURE,
        error: ""
      })
    ).toEqual({
      users: null,
      isLoading: false,
      error: ""
    });
  });
});

describe("Action Creators", () => {
  it("invite request", () => {
    const expectedAction = {
      type: actionTypes.INVITE_USER.REQUEST
    };
    expect(actionCreators.inviteUser.request()).toEqual(expectedAction);
  });
  it("invite success", () => {
    const expectedAction = {
      type: actionTypes.INVITE_USER.SUCCESS
    };
    expect(actionCreators.inviteUser.success()).toEqual(expectedAction);
  });
  it("invite failure", () => {
    const expectedAction = {
      type: actionTypes.INVITE_USER.FAILURE
    };
    expect(actionCreators.inviteUser.failure()).toEqual(expectedAction);
  });
});

let govAdminToken;
let campaignAdminToken;
let campaignStaffToken;
let governmentId;
let campaignId;
describe("Side Effects", () => {
  beforeAll(async () => {
    let tokenResponse = await api.login(
      "govadmin@openelectionsportland.org",
      "password"
    );
    govAdminToken = tokenResponse.headers
      .get("set-cookie")
      .match(/=([a-zA-Z0-9].+); Path/)[1];
    let decodedToken = api.decodeToken(govAdminToken);
    governmentId = decodedToken.permissions[0]["id"];

    tokenResponse = await api.login(
      "campaignadmin@openelectionsportland.org",
      "password"
    );
    campaignAdminToken = tokenResponse.headers
      .get("set-cookie")
      .match(/=([a-zA-Z0-9].+); Path/)[1];
    decodedToken = api.decodeToken(campaignAdminToken);
    campaignId = decodedToken.permissions[0]["id"];

    tokenResponse = await api.login(
      "campaignstaff@openelectionsportland.org",
      "password"
    );
    campaignStaffToken = tokenResponse.headers
      .get("set-cookie")
      .match(/=([a-zA-Z0-9].+); Path/)[1];
  });

  beforeEach(() => {
    delete process.env.TOKEN;
  });

  it("invite user to gov", async () => {
    const expectedActions = [
      { type: actionTypes.INVITE_USER.REQUEST },
      { type: actionTypes.INVITE_USER.SUCCESS }
    ];
    const store = mockStore({});

    process.env.TOKEN = govAdminToken;

    return store
      .dispatch(
        users.inviteUser(
          "govadmin1@openelectionsportland.org",
          "Government2",
          "Admin2",
          governmentId
        )
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("invite user to gov failure", async () => {
    const expectedActions = [
      { type: actionTypes.INVITE_USER.REQUEST },
      { type: actionTypes.INVITE_USER.FAILURE }
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    return store
      .dispatch(
        users.inviteUser(
          "govadmin1@openelectionsportland.org",
          "Government2",
          "Admin2",
          governmentId
        )
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("invite user to campaign", async () => {
    const expectedActions = [
      { type: actionTypes.INVITE_USER.REQUEST },
      { type: actionTypes.INVITE_USER.SUCCESS }
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    return store
      .dispatch(
        users.inviteUser(
          "campaignadmin1@openelectionsportland.org",
          "Government2",
          "Admin2",
          campaignId,
          UserRoleEnum.CAMPAIGN_STAFF
        )
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("invite user to campaign failure", async () => {
    const expectedActions = [
      { type: actionTypes.INVITE_USER.REQUEST },
      { type: actionTypes.INVITE_USER.FAILURE }
    ];
    const store = mockStore({});

    return store
      .dispatch(
        users.inviteUser(
          "campaignadmin1@openelectionsportland.org",
          "Government2",
          "Admin2",
          campaignId,
          UserRoleEnum.CAMPAIGN_STAFF
        )
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
