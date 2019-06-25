import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as contributions from "./contributions";
import * as api from "../../api";
import * as schema from "../../api/schema";
import {
  UserRoleEnum,
  ContributionStatusEnum,
  ContributionSubTypeEnum,
  ContributionTypeEnum,
  ContributorTypeEnum,
  PhoneTypeEnum
} from "../../api";
import { ADD_ENTITIES } from "./common";

const { actionTypes, actionCreators } = contributions;

const middlewares = [thunk.withExtraArgument({ api, schema })];
const mockStore = configureMockStore(middlewares);

describe("Reducer", () => {
  const reducer = contributions.default;
  it("initial state", () => {
    expect(reducer(undefined, {})).toEqual({
      isLoading: false,
      error: null
    });
  });

  it("adds contribution entities", () => {
    expect(
      reducer(undefined, {
        type: ADD_ENTITIES,
        payload: {
          contributions: {
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
  it("create contribution request", () => {
    const expectedAction = {
      type: actionTypes.CREATE_CONTRIBUTION.REQUEST
    };
    expect(actionCreators.createContribution.request()).toEqual(expectedAction);
  });
  it("create contribution success", () => {
    const expectedAction = {
      type: actionTypes.CREATE_CONTRIBUTION.SUCCESS
    };
    expect(actionCreators.createContribution.success()).toEqual(expectedAction);
  });
  it("create contribution failure", () => {
    const expectedAction = {
      type: actionTypes.CREATE_CONTRIBUTION.FAILURE
    };
    expect(actionCreators.createContribution.failure()).toEqual(expectedAction);
  });
});

let govAdminToken;
let campaignAdminToken;
let campaignStaffToken;
let governmentId;
let campaignId;
let campaignStaffId;
let campaignAdminId;
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
    campaignAdminId = decodedToken.id;

    tokenResponse = await api.login(
      "campaignstaff@openelectionsportland.org",
      "password"
    );
    campaignStaffToken = tokenResponse.headers
      .get("set-cookie")
      .match(/=([a-zA-Z0-9].+); Path/)[1];
    decodedToken = api.decodeToken(campaignStaffToken);
    campaignStaffId = decodedToken.id;
  });

  beforeEach(() => {
    delete process.env.TOKEN;
  });

  it("creates contribution", async () => {
    const expectedActions = [
      { type: actionTypes.CREATE_CONTRIBUTION.REQUEST },
      { type: ADD_ENTITIES },
      { type: actionTypes.CREATE_CONTRIBUTION.SUCCESS }
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignStaffToken;
    return store
      .dispatch(
        contributions.createContribution({
          address1: "123 ABC ST",
          amount: 250,
          campaignId: campaignId,
          city: "Portland",
          currentUserId: campaignStaffId,
          date: Date.now(),
          firstName: "John",
          middleInitial: "",
          lastName: "Doe",
          governmentId: governmentId,
          type: ContributionTypeEnum.CONTRIBUTION,
          subType: ContributionSubTypeEnum.CASH,
          state: "OR",
          status: ContributionStatusEnum.DRAFT,
          zip: "97214",
          contributorType: ContributorTypeEnum.INDIVIDUAL
        })
      )
      .then(() => {
        const actions = store.getActions();
        expect(actions[0].type).toEqual(expectedActions[0].type);
        expect(actions[1].type).toEqual(expectedActions[1].type);
        expect(actions[2].type).toEqual(expectedActions[2].type);
      });
  });

  it("updates contribution", async () => {
    const expectedActions = [
      { type: actionTypes.UPDATE_CONTRIBUTION.REQUEST },
      { type: actionTypes.UPDATE_CONTRIBUTION.SUCCESS }
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    const contribution = await api.createContribution({
      address1: "123 ABC ST",
      amount: 250,
      campaignId: campaignId,
      city: "Portland",
      currentUserId: campaignAdminId,
      date: Date.now(),
      firstName: "John",
      middleInitial: "",
      lastName: "Doe",
      governmentId: governmentId,
      type: ContributionTypeEnum.CONTRIBUTION,
      subType: ContributionSubTypeEnum.CASH,
      state: "OR",
      status: ContributionStatusEnum.DRAFT,
      zip: "97214",
      contributorType: ContributorTypeEnum.INDIVIDUAL
    });
    const { id } = await contribution.json();

    return store
      .dispatch(
        contributions.updateContribution({
          id,
          firstName: "Ian",
          currentUserId: campaignAdminId
        })
      )
      .then(() => {
        const actions = store.getActions();
        expect(actions[0].type).toEqual(expectedActions[0].type);
        expect(actions[1].type).toEqual(expectedActions[1].type);
      });
  });

  it("gets contributions", async () => {
    const expectedActions = [
      { type: actionTypes.GET_CONTRIBUTIONS.REQUEST },
      { type: ADD_ENTITIES },
      { type: actionTypes.GET_CONTRIBUTIONS.SUCCESS }
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    return store
      .dispatch(
        contributions.getContributions({
          governmentId: governmentId,
          campaignId: campaignId,
          currentUserId: campaignAdminId
        })
      )
      .then(() => {
        const actions = store.getActions();
        expect(actions[0].type).toEqual(expectedActions[0].type);
        expect(actions[1].type).toEqual(expectedActions[1].type);
        expect(actions[2].type).toEqual(expectedActions[2].type);
      });
  });

  it("gets contribution by id", async () => {
    const expectedActions = [
      { type: actionTypes.GET_CONTRIBUTION_BY_ID.REQUEST },
      { type: ADD_ENTITIES },
      { type: actionTypes.GET_CONTRIBUTION_BY_ID.SUCCESS }
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    const contribution = await api.createContribution({
      address1: "123 ABC ST",
      amount: 250,
      campaignId: campaignId,
      city: "Portland",
      currentUserId: campaignAdminId,
      date: Date.now(),
      firstName: "John",
      middleInitial: "",
      lastName: "Doe",
      governmentId: governmentId,
      type: ContributionTypeEnum.CONTRIBUTION,
      subType: ContributionSubTypeEnum.CASH,
      state: "OR",
      status: ContributionStatusEnum.DRAFT,
      zip: "97214",
      contributorType: ContributorTypeEnum.INDIVIDUAL
    });
    const { id } = await contribution.json();

    return store
      .dispatch(
        contributions.getContributionById({
          id,
          governmentId: governmentId,
          campaignId: campaignId,
          currentUserId: campaignAdminId
        })
      )
      .then(() => {
        const actions = store.getActions();
        expect(actions[0].type).toEqual(expectedActions[0].type);
        expect(actions[1].type).toEqual(expectedActions[1].type);
        expect(actions[2].type).toEqual(expectedActions[2].type);
      });
  });
});