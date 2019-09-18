import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as matches from './matches';
import * as api from '../../api';
import * as schema from '../../api/schema';
import { ADD_ENTITIES } from './common';

const { actionTypes, actionCreators } = matches;

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
  const reducer = matches.default;
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isLoading: false,
      error: null,
      list: {},
    });
  });

  it('adds match entities', () => {
    expect(
      reducer(undefined, {
        type: ADD_ENTITIES,
        payload: {
          matches: {
            '1': {},
          },
        },
      })
    ).toEqual({
      list: {
        '1': {},
      },
      isLoading: false,
      error: null,
    });
  });
});

describe('Action Creators', () => {
  it('get matches request', () => {
    const expectedAction = {
      type: actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.REQUEST,
    };
    expect(actionCreators.getMatchesByContributionId.request()).toEqual(
      expectedAction
    );
  });
  it('get matches success', () => {
    const expectedAction = {
      type: actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.SUCCESS,
    };
    expect(actionCreators.getMatchesByContributionId.success()).toEqual(
      expectedAction
    );
  });
  it('get matches failure', () => {
    const expectedAction = {
      type: actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.FAILURE,
    };
    expect(actionCreators.getMatchesByContributionId.failure()).toEqual(
      expectedAction
    );
  });
});

let govAdminToken;
let campaignAdminToken;
let campaignStaffToken;
let governmentId;
let campaignId;
let campaignAdminId;
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
    campaignAdminId = decodedToken.id;

    tokenResponse = await api.login(
      'matchestaff@openelectionsportland.org',
      'password'
    );
    campaignStaffToken = tokenResponse.headers
      .get('set-cookie')
      .match(/=([a-zA-Z0-9].+); Path/)[1];
  });

  beforeEach(() => {
    delete process.env.TOKEN;
  });

  it('gets matches', async () => {
    const expectedActions = [
      { type: actionTypes.GET_CAMPAIGNS.REQUEST },
      { type: ADD_ENTITIES },
      { type: actionTypes.GET_CAMPAIGNS.SUCCESS },
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    let contribution = await api.createContribution({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignAdminId,
      date: 1562436237700,
      firstName: 'John',
      middleInitial: '',
      lastName: 'Doe',
      governmentId,
      type: api.ContributionTypeEnum.CONTRIBUTION,
      subType: api.ContributionSubTypeEnum.CASH,
      paymentMethod: api.PaymentMethodEnum.CASH,
      state: 'OR',
      status: api.ContributionStatusEnum.DRAFT,
      zip: '97214',
      contributorType: api.ContributorTypeEnum.INDIVIDUAL,
    });
    contribution = await contribution.json();

    return store
      .dispatch(matches.getMatchesByContributionId(contribution.id))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0].type).toEqual(expectedActions[0].type);
        expect(actions[1].type).toEqual(expectedActions[1].type);
        expect(actions[2].type).toEqual(expectedActions[2].type);
      });
  });
});
