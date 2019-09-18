import * as api from './api';

let govAdminToken;
let campaignAdminToken;
let campaignStaffToken;
let governmentId;
let campaignId;
let campaignStaffId;
let campaignAdminId;

describe('API', () => {
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

  it('decodeToken', () => {
    const decoded = api.decodeToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEwOSwiZXhwIjoxNTU4NTQ2OTE5OTk5LCJmaXJzdE5hbWUiOiJHb3Zlcm5tZW50IiwibGFzdE5hbWUiOiJBZG1pbiIsImVtYWlsIjoiZ292YWRtaW5Ab3BlbmVsZWN0aW9uc3BvcnRsYW5kLm9yZyIsInBlcm1pc3Npb25zIjpbeyJyb2xlIjoiZ292ZXJubWVudF9hZG1pbiIsInR5cGUiOiJnb3Zlcm5tZW50IiwiaWQiOjI0MTF9XSwiaWF0IjoxNTU4Mjg3NzE5fQ.qdSVIWO8yJ0ZR73MUGfyW1TQDOrhfcaOBEOTvEK_dUs'
    );
    expect(decoded.email).toEqual('govadmin@openelectionsportland.org');
    expect(decoded.firstName).toEqual('Government');
    expect(decoded.lastName).toEqual('Admin');
    expect(decoded.permissions.length).toEqual(1);
    expect(decoded.permissions[0].role).toEqual('government_admin');
    expect(decoded.permissions[0].type).toEqual('government');
  });

  it('login govadmin success', async () => {
    const response = await api.login(
      'govadmin@openelectionsportland.org',
      'password'
    );
    govAdminToken = response.headers
      .get('set-cookie')
      .match(/=([a-zA-Z0-9].+); Path/)[1];
    expect(govAdminToken).toBeDefined();
  });

  it('login campaignadmin success', async () => {
    const response = await api.login(
      'campaignadmin@openelectionsportland.org',
      'password'
    );
    campaignAdminToken = response.headers
      .get('set-cookie')
      .match(/=([a-zA-Z0-9].+); Path/)[1];
    expect(campaignAdminToken).toBeDefined();
  });

  it('login campaignstaff success1', async () => {
    const response = await api.login(
      'campaignstaff@openelectionsportland.org',
      'password'
    );
    campaignStaffToken = response.headers
      .get('set-cookie')
      .match(/=([a-zA-Z0-9].+); Path/)[1];
    expect(campaignStaffToken).toBeDefined();
  });

  it('login fail', async () => {
    const response = await api.login(
      'govadmin@openelectionsportland.org',
      'password1'
    );
    expect(response.status).toEqual(401);
  });

  it('me', async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.me();
    expect(response.email).toEqual('govadmin@openelectionsportland.org');
    expect(response.firstName).toEqual('Government');
    expect(response.lastName).toEqual('Admin');
    expect(response.permissions.length).toEqual(1);
    expect(response.permissions[0].role).toEqual('government_admin');
    expect(response.permissions[0].type).toEqual('government');
    governmentId = response.permissions[0].id;
    process.env.TOKEN = null;
  });

  it('inviteUsertoGovernment', async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.inviteUsertoGovernment(
      'govadmin1@openelectionsportland.org',
      'Government2',
      'Admin2',
      governmentId
    );
    expect(response.status).toEqual(201);
    process.env.TOKEN = null;
  });

  it('inviteUsertoCampaign as govAdmin', async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.inviteUsertoCampaign(
      'campaignadmin1@openelectionsportland.org',
      'Government2',
      'Admin2',
      campaignId,
      api.UserRoleEnum.CAMPAIGN_STAFF
    );
    expect(response.status).toEqual(201);
    process.env.TOKEN = null;
  });

  it('inviteUsertoCampaign as campaignAdmin', async () => {
    process.env.TOKEN = campaignAdminToken;
    const response = await api.inviteUsertoCampaign(
      'campaignadmin2@openelectionsportland.org',
      'Government2',
      'Admin2',
      campaignId,
      api.UserRoleEnum.CAMPAIGN_ADMIN
    );
    expect(response.status).toEqual(201);
    process.env.TOKEN = null;
  });

  it('redeemInvite', async () => {
    const response = await api.redeemInvite('inviteme', 'password');
    expect(response.status).toEqual(204);
  });

  it('getCampaignUsers', async () => {
    process.env.TOKEN = campaignAdminToken;
    const response = await api.getCampaignUsers(campaignId);
    expect(response.length > 1).toBeTruthy();
    process.env.TOKEN = null;
  });

  it('getGovernmentUsers', async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.getGovernmentUsers(governmentId);
    expect(response.length > 1).toBeTruthy();
  });

  it('sendPasswordResetEmail', async () => {
    const response = await api.sendPasswordResetEmail(
      'campaignstaff@openelectionsportland.org'
    );
    expect(response.status).toEqual(204);
  });

  it('resetPassword', async () => {
    const response = await api.resetPassword('resetme', 'newpassword');

    expect(response.status).toEqual(204);
  });

  it('updatePassword', async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.updatePassword('password', 'newpassword');
    expect(response.status).toEqual(204);
  });

  it('createCampaignForGovernment', async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.createCampaignForGovernment({
      governmentId,
      name: 'Test for Mayor',
      officeSought: 'Mayor',
    });
    expect(response.status).toEqual(201);
  });

  it('getCampaignsForGovernment', async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.getCampaignsForGovernment(governmentId);
    expect(response.length > 1).toBeTruthy();
  });

  it('getGovernmentActivities', async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.getGovernmentActivities(governmentId);
    expect(response.length > 1).toBeTruthy();
  });

  it('getCampaignActivities', async () => {
    process.env.TOKEN = campaignAdminToken;
    const response = await api.getCampaignActivities(campaignId);
    expect(response.length > 1).toBeTruthy();
  });

  it('createContribution', async () => {
    process.env.TOKEN = campaignStaffToken;
    const response = await api.createContribution({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignStaffId,
      date: 1562436237619,
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
    expect(response.status).toEqual(201);
  });

  it('getContributionActivities', async () => {
    process.env.TOKEN = campaignAdminToken;
    let contribution = await api.createContribution({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignStaffId,
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

    const response = await api.getContributionActivities(contribution.id);
    expect(response.length >= 1).toBeTruthy();
  });

  it('updateContribution', async () => {
    process.env.TOKEN = campaignStaffToken;

    let response = await api.createContribution({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignAdminId,
      date: 1562436237619,
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
    const contribution = await response.json();

    response = await api.updateContribution({
      id: contribution.id,
      firstName: 'Ian',
      currentUserId: campaignStaffId,
    });
    expect(response.status).toEqual(204);
  });

  it('getContributions', async () => {
    process.env.TOKEN = campaignStaffToken;
    const response = await api.getContributions({
      governmentId,
      campaignId,
      currentUserId: campaignAdminId,
    });
    expect(response.status).toEqual(200);
  });

  it('getContributionById', async () => {
    process.env.TOKEN = campaignStaffToken;
    const contribution = await api.createContribution({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignStaffId,
      date: 1562436237619,
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
    const { id } = await contribution.json();
    const response = await api.getContributionById(id);
    expect(response.status).toEqual(200);
  });

  it('removePermission', async () => {
    process.env.TOKEN = campaignAdminToken;
    const tokenResponse = await api.login(
      'campaignstaff+removeme@openelectionsportland.org',
      'password'
    );

    const token = tokenResponse.headers
      .get('set-cookie')
      .match(/=([a-zA-Z0-9].+); Path/)[1];

    const user = api.decodeToken(token);

    const permissionId = user.permissions[0].id;
    const response = await api.removePermission(permissionId);
    expect(response.status).toEqual(200);
  });

  it('archiveContribution', async () => {
    process.env.TOKEN = campaignStaffToken;
    let contribution = await api.createContribution({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignStaffId,
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

    let response = await api.archiveContribution(contribution.id);
    expect(response.status).toEqual(200);
    response = await api.getContributionById(contribution.id);
    contribution = await response.json();
    expect(contribution.status).toEqual(api.ContributionStatusEnum.ARCHIVED);
  });

  it('createExpenditure', async () => {
    process.env.TOKEN = campaignStaffToken;
    const response = await api.createExpenditure({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignStaffId,
      date: 1562436237700,
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
    expect(response.status).toEqual(201);
  });

  it('getExpenditures', async () => {
    process.env.TOKEN = campaignStaffToken;
    const response = await api.getExpenditures({
      governmentId,
      campaignId,
      currentUserId: campaignStaffId,
    });
    expect(response.status).toEqual(200);
  });

  it('updateExpenditure', async () => {
    process.env.TOKEN = campaignStaffToken;

    let response = await api.createExpenditure({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignStaffId,
      date: 1562436237700,
      governmentId,
      type: api.ExpenditureTypeEnum.EXPENDITURE,
      subType: api.ExpenditureSubTypeEnum.CASH_EXPENDITURE,
      state: 'OR',
      status: api.ExpenditureStatusEnum.DRAFT,
      zip: '97214',
      payeeType: api.PayeeTypeEnum.INDIVIDUAL,
      name: 'Test Expenditure',
      description: 'This is an update test',
    });
    const expenditure = await response.json();

    response = await api.updateExpenditure({
      id: expenditure.id,
      amount: 500,
      currentUserId: campaignStaffId,
    });
    expect(response.status).toEqual(204);
  });

  it('getExpenditureActivities', async () => {
    process.env.TOKEN = campaignStaffToken;

    let response = await api.createExpenditure({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignStaffId,
      date: 1562436237700,
      governmentId,
      type: api.ExpenditureTypeEnum.EXPENDITURE,
      subType: api.ExpenditureSubTypeEnum.CASH_EXPENDITURE,
      state: 'OR',
      status: api.ExpenditureStatusEnum.DRAFT,
      zip: '97214',
      payeeType: api.PayeeTypeEnum.INDIVIDUAL,
      name: 'Test Expenditure',
      description: 'This is an update test',
    });
    const expenditure = await response.json();

    response = await api.getExpenditureActivities(expenditure.id);
    expect(response.length >= 1).toBeTruthy();
  });

  it('postExpenditureComment', async () => {
    process.env.TOKEN = campaignStaffToken;

    let response = await api.createExpenditure({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignStaffId,
      date: 1562436237700,
      governmentId,
      type: api.ExpenditureTypeEnum.EXPENDITURE,
      subType: api.ExpenditureSubTypeEnum.CASH_EXPENDITURE,
      state: 'OR',
      status: api.ExpenditureStatusEnum.DRAFT,
      zip: '97214',
      payeeType: api.PayeeTypeEnum.INDIVIDUAL,
      name: 'Test Expenditure',
      description: 'This is an update test',
    });
    const expenditure = await response.json();

    response = await api.postExpenditureComment(
      expenditure.id,
      'This is a comment'
    );
    expect(response.status).toEqual(204);
  });

  it('getExpenditure', async () => {
    process.env.TOKEN = campaignStaffToken;

    let response = await api.createExpenditure({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignStaffId,
      date: 1562436237700,
      governmentId,
      type: api.ExpenditureTypeEnum.EXPENDITURE,
      subType: api.ExpenditureSubTypeEnum.CASH_EXPENDITURE,
      state: 'OR',
      status: api.ExpenditureStatusEnum.DRAFT,
      zip: '97214',
      payeeType: api.PayeeTypeEnum.INDIVIDUAL,
      name: 'Test Expenditure',
      description: 'This is an update test',
    });
    const expenditure = await response.json();

    response = await api.getExpenditureById(expenditure.id);
    expect(response.status).toEqual(200);
  });

  it('postContributionComment', async () => {
    process.env.TOKEN = campaignStaffToken;
    let contribution = await api.createContribution({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignStaffId,
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

    const response = await api.postContributionComment(
      contribution.id,
      'This is a comment'
    );
    expect(response.status).toEqual(204);
  });

  it('getMatchesByContributionId', async () => {
    process.env.TOKEN = campaignStaffToken;
    let contribution = await api.createContribution({
      address1: '123 ABC ST',
      amount: 250,
      campaignId,
      city: 'Portland',
      currentUserId: campaignStaffId,
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

    const response = await api.getMatchesByContributionId(contribution.id);
    expect(response.status).toEqual(200);
  });
});
