import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as expenditures from './expenditures';
import * as api from '../../api';
import * as schema from '../../api/schema';
import { ADD_ENTITIES } from './common';

const { actionTypes, actionCreators } = expenditures;

const middlewares = [thunk.withExtraArgument({ api, schema })];
const mockStore = configureMockStore(middlewares);

describe('Reducer', () => {
  const reducer = expenditures.default;
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isLoading: false,
      error: null,
    });
  });

  it('adds expenditure entities', () => {
    expect(
      reducer(undefined, {
        type: ADD_ENTITIES,
        payload: {
          expenditures: {
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
});

describe('Action Creators', () => {
  it('create expenditure request', () => {
    const expectedAction = {
      type: actionTypes.CREATE_EXPENDITURE.REQUEST,
    };
    expect(actionCreators.createExpenditure.request()).toEqual(expectedAction);
  });
  it('create expenditure success', () => {
    const expectedAction = {
      type: actionTypes.CREATE_EXPENDITURE.SUCCESS,
    };
    expect(actionCreators.createExpenditure.success()).toEqual(expectedAction);
  });
  it('create expenditure failure', () => {
    const expectedAction = {
      type: actionTypes.CREATE_EXPENDITURE.FAILURE,
    };
    expect(actionCreators.createExpenditure.failure()).toEqual(expectedAction);
  });
});

let govAdminToken;
let campaignAdminToken;
let campaignStaffToken;
let governmentId;
let campaignId;
let campaignStaffId;
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
      'campaignstaff@openelectionsportland.org',
      'password'
    );
    campaignStaffToken = tokenResponse.headers
      .get('set-cookie')
      .match(/=([a-zA-Z0-9].+); Path/)[1];
    decodedToken = api.decodeToken(campaignStaffToken);
    campaignStaffId = decodedToken.id;
  });

  beforeEach(() => {
    delete process.env.TOKEN;
  });

  it('creates expenditure testme', async () => {
    const expectedActions = [
      { type: actionTypes.CREATE_EXPENDITURE.REQUEST },
      { type: ADD_ENTITIES },
      { type: actionTypes.CREATE_EXPENDITURE.SUCCESS },
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignStaffToken;
    return store
      .dispatch(
        expenditures.createExpenditure({
          address1: '123 ABC ST',
          amount: 250,
          campaignId,
          city: 'Portland',
          currentUserId: campaignStaffId,
          date: 1565060230243,
          governmentId,
          type: api.ExpenditureTypeEnum.EXPENDITURE,
          subType: api.ExpenditureSubTypeEnum.CASH_EXPENDITURE,
          state: 'OR',
          status: api.ExpenditureStatusEnum.DRAFT,
          zip: '97214',
          payeeType: api.PayeeTypeEnum.INDIVIDUAL,
          name: 'Test Expenditure',
          description: 'This is a test',
        })
      )
      .then(() => {
        const actions = store.getActions();
        expect(actions[0].type).toEqual(expectedActions[0].type);
        expect(actions[1].type).toEqual(expectedActions[1].type);
        expect(actions[2].type).toEqual(expectedActions[2].type);
      });
  });

  it('gets expenditures', async () => {
    const expectedActions = [
      { type: actionTypes.GET_EXPENDITURES.REQUEST },
      { type: ADD_ENTITIES },
      { type: actionTypes.GET_EXPENDITURES.SUCCESS },
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    return store
      .dispatch(
        expenditures.getExpenditures({
          governmentId,
          campaignId,
          currentUserId: campaignAdminId,
        })
      )
      .then(() => {
        const actions = store.getActions();
        expect(actions[0].type).toEqual(expectedActions[0].type);
        expect(actions[1].type).toEqual(expectedActions[1].type);
        expect(actions[2].type).toEqual(expectedActions[2].type);
      });
  });

  it('updates expenditure', async () => {
    const expectedActions = [
      { type: actionTypes.UPDATE_EXPENDITURE.REQUEST },
      { type: actionTypes.UPDATE_EXPENDITURE.SUCCESS },
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    const expenditure = await api.createExpenditure({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignStaffId,
      date: 1564881802534,
      governmentId,
      type: api.ExpenditureTypeEnum.EXPENDITURE,
      subType: api.ExpenditureSubTypeEnum.CASH_EXPENDITURE,
      state: 'OR',
      status: api.ExpenditureStatusEnum.DRAFT,
      zip: '97214',
      payeeType: api.PayeeTypeEnum.INDIVIDUAL,
      name: 'Test Expenditure',
      description: 'This is a test',
    });
    const { id } = await expenditure.json();

    return store
      .dispatch(
        expenditures.updateExpenditure({
          id,
          amount: 500,
          currentUserId: campaignAdminId,
        })
      )
      .then(() => {
        const actions = store.getActions();
        expect(actions[0].type).toEqual(expectedActions[0].type);
        expect(actions[1].type).toEqual(expectedActions[1].type);
      });
  });

  it('gets expenditure', async () => {
    const expectedActions = [
      { type: actionTypes.GET_EXPENDITURE_BY_ID.REQUEST },
      { type: ADD_ENTITIES },
      { type: actionTypes.GET_EXPENDITURE_BY_ID.SUCCESS },
    ];
    const store = mockStore({});

    process.env.TOKEN = campaignAdminToken;

    const expenditure = await api.createExpenditure({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignStaffId,
      date: 1564881802534,
      governmentId,
      type: api.ExpenditureTypeEnum.EXPENDITURE,
      subType: api.ExpenditureSubTypeEnum.CASH_EXPENDITURE,
      state: 'OR',
      status: api.ExpenditureStatusEnum.DRAFT,
      zip: '97214',
      payeeType: api.PayeeTypeEnum.INDIVIDUAL,
      name: 'Test Expenditure',
      description: 'This is a test',
    });
    const { id } = await expenditure.json();

    return store.dispatch(expenditures.getExpenditureById(id)).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).toEqual(expectedActions[0].type);
      expect(actions[1].type).toEqual(expectedActions[1].type);
      expect(actions[2].type).toEqual(expectedActions[2].type);
    });
  });
});
