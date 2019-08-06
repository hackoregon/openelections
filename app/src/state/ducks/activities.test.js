import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as activities from "./activities";
import * as api from "../../api";
import * as schema from "../../api/schema";
import { UserRoleEnum } from "../../api";
import { ADD_ENTITIES } from "./common";

const { actionTypes, actionCreators } = activities;

const middlewares = [thunk.withExtraArgument({ api, schema })];
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
  const reducer = activities.default;
  it("initial state", () => {
    expect(reducer(undefined, {})).toEqual({
      isLoading: false,
      error: null
    });
  });

  it("adds activity entities", () => {
    expect(
      reducer(undefined, {
        type: ADD_ENTITIES,
        payload: {
          activities: {
            "1": {}
          }
        }
      })
    ).toEqual({
      "1": {},
      isLoading: false,
      error: null
    });
  });
});

describe("Action Creators", () => {
  it("get campaign activities request", () => {
    const expectedAction = {
      type: actionTypes.GET_CAMPAIGN_ACTIVITIES.REQUEST
    };
    expect(actionCreators.getCampaignActivities.request()).toEqual(
      expectedAction
    );
  });
  it("get campaign activities success", () => {
    const expectedAction = {
      type: actionTypes.GET_CAMPAIGN_ACTIVITIES.SUCCESS
    };
    expect(actionCreators.getCampaignActivities.success()).toEqual(
      expectedAction
    );
  });
  it("get campaign activities failure", () => {
    const expectedAction = {
      type: actionTypes.GET_CAMPAIGN_ACTIVITIES.FAILURE
    };
    expect(actionCreators.getCampaignActivities.failure()).toEqual(
      expectedAction
    );
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
    governmentId = decodedToken.permissions[0]["governmentId"];

    tokenResponse = await api.login(
      "campaignadmin@openelectionsportland.org",
      "password"
    );
    campaignAdminToken = tokenResponse.headers
      .get("set-cookie")
      .match(/=([a-zA-Z0-9].+); Path/)[1];
    decodedToken = api.decodeToken(campaignAdminToken);
    campaignId = decodedToken.permissions[0]["campaignId"];

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

  it("gets campaign activities", async () => {
    const expectedActions = [
      { type: actionTypes.GET_CAMPAIGN_ACTIVITIES.REQUEST },
      { type: ADD_ENTITIES },
      { type: actionTypes.GET_CAMPAIGN_ACTIVITIES.SUCCESS }
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    return store
      .dispatch(activities.getCampaignActivities(campaignId))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0].type).toEqual(expectedActions[0].type);
        expect(actions[1].type).toEqual(expectedActions[1].type);
        expect(actions[2].type).toEqual(expectedActions[2].type);
      });
  });

  it("gets CONTRIBUTION activities", async () => {
    const expectedActions = [
      { type: actionTypes.GET_CONTRIBUTION_ACTIVITIES.REQUEST },
      { type: ADD_ENTITIES },
      { type: actionTypes.GET_CONTRIBUTION_ACTIVITIES.SUCCESS }
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    return store
      .dispatch(activities.getContributionActivities(1))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0].type).toEqual(expectedActions[0].type);
        expect(actions[1].type).toEqual(expectedActions[1].type);
        expect(actions[2].type).toEqual(expectedActions[2].type);
      });
  });

  it("gets EXPENDITURE activities", async () => {
    const expectedActions = [
      { type: actionTypes.GET_EXPENDITURE_ACTIVITIES.REQUEST },
      { type: ADD_ENTITIES },
      { type: actionTypes.GET_EXPENDITURE_ACTIVITIES.SUCCESS }
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    return store
      .dispatch(activities.getExpenditureActivities(1))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0].type).toEqual(expectedActions[0].type);
        expect(actions[1].type).toEqual(expectedActions[1].type);
        expect(actions[2].type).toEqual(expectedActions[2].type);
      });
  });
});
