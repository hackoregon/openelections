import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as campaigns from './campaigns';
import * as api from '../../api';
import * as schema from '../../api/schema';
import { ADD_ENTITIES } from './common';

const { actionTypes, actionCreators } = campaigns;

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
  const reducer = campaigns.default;
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      currentCampaignId: null,
      isLoading: false,
      error: null,
      list: {},
    });
  });

  it('adds campaign entities', () => {
    expect(
      reducer(undefined, {
        type: ADD_ENTITIES,
        payload: {
          campaigns: {
            '1': {},
          },
        },
      })
    ).toEqual({
      list: {
        '1': {},
      },
      currentCampaignId: null,
      isLoading: false,
      error: null,
    });
  });

  it('sets current campaign', () => {
    expect(
      reducer(
        {
          currentCampaignId: null,
          isLoading: false,
          error: null,
        },
        {
          type: actionTypes.SET_CAMPAIGN.SUCCESS,
          campaignId: 1,
        }
      )
    ).toEqual({
      currentCampaignId: 1,
      isLoading: false,
      error: null,
    });
  });
});

describe('Action Creators', () => {
  it('create campaign request', () => {
    const expectedAction = {
      type: actionTypes.CREATE_CAMPAIGN.REQUEST,
    };
    expect(actionCreators.createCampaign.request()).toEqual(expectedAction);
  });
  it('create campaign success', () => {
    const expectedAction = {
      type: actionTypes.CREATE_CAMPAIGN.SUCCESS,
    };
    expect(actionCreators.createCampaign.success()).toEqual(expectedAction);
  });
  it('create campaign failure', () => {
    const expectedAction = {
      type: actionTypes.CREATE_CAMPAIGN.FAILURE,
    };
    expect(actionCreators.createCampaign.failure()).toEqual(expectedAction);
  });
  it('set campaign success', () => {
    const expectedAction = {
      type: actionTypes.SET_CAMPAIGN.SUCCESS,
      campaignId: 1,
    };
    expect(actionCreators.setCampaign.success(1)).toEqual(expectedAction);
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

  it('creates campaign for government testme', async () => {
    const expectedActions = [
      { type: actionTypes.CREATE_CAMPAIGN.REQUEST },
      { type: ADD_ENTITIES },
      { type: actionTypes.CREATE_CAMPAIGN.SUCCESS },
    ];
    const store = mockStore({});

    process.env.TOKEN = govAdminToken;

    return store
      .dispatch(
        campaigns.createCampaignForGovernment(
          governmentId,
          'Test New Gov Campaign',
          'Mayor',
          'campaignadminbygov@openelectionsportland.org',
          'CampaignAdmin',
          'InvitedByGov'
        )
      )
      .then(() => {
        const actions = store.getActions();
        expect(actions[0].type).toEqual(expectedActions[0].type);
        expect(actions[1].type).toEqual(expectedActions[1].type);
        expect(actions[2].type).toEqual(expectedActions[2].type);
      });
  });

  it('gets campaigns', async () => {
    const expectedActions = [
      { type: actionTypes.GET_CAMPAIGNS.REQUEST },
      { type: ADD_ENTITIES },
      { type: actionTypes.GET_CAMPAIGNS.SUCCESS },
    ];
    const store = mockStore({});

    process.env.TOKEN = govAdminToken;

    return store.dispatch(campaigns.getCampaigns(governmentId)).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).toEqual(expectedActions[0].type);
      expect(actions[1].type).toEqual(expectedActions[1].type);
      expect(actions[2].type).toEqual(expectedActions[2].type);
    });
  });
});
