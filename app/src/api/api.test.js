import * as api from "./api";
import {
  UserRoleEnum,
  ContributionStatusEnum,
  ContributionSubTypeEnum,
  ContributionTypeEnum,
  ContributorTypeEnum,
  PhoneTypeEnum
} from "./api";

let govAdminToken;
let campaignAdminToken;
let campaignStaffToken;
let governmentId;
let campaignId;
let campaignStaffId;
let campaignAdminId;

describe("API", () => {
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

  it("baseUrl", async function() {
    expect(api.baseUrl()).toEqual("http://localhost:3000");
    process.env.NODE_ENV = "development";
    expect(api.baseUrl()).toEqual("http://localhost:3000");
    process.env.NODE_ENV = "staging";
    expect(api.baseUrl()).toEqual("https://api.qa.openelectinosports.org");
    process.env.NODE_ENV = "production";
    expect(api.baseUrl()).toEqual("https://api.openelectinosports.org");
    process.env.NODE_ENV = "test";
  });

  it("decodeToken", () => {
    const decoded = api.decodeToken(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEwOSwiZXhwIjoxNTU4NTQ2OTE5OTk5LCJmaXJzdE5hbWUiOiJHb3Zlcm5tZW50IiwibGFzdE5hbWUiOiJBZG1pbiIsImVtYWlsIjoiZ292YWRtaW5Ab3BlbmVsZWN0aW9uc3BvcnRsYW5kLm9yZyIsInBlcm1pc3Npb25zIjpbeyJyb2xlIjoiZ292ZXJubWVudF9hZG1pbiIsInR5cGUiOiJnb3Zlcm5tZW50IiwiaWQiOjI0MTF9XSwiaWF0IjoxNTU4Mjg3NzE5fQ.qdSVIWO8yJ0ZR73MUGfyW1TQDOrhfcaOBEOTvEK_dUs"
    );
    expect(decoded.email).toEqual("govadmin@openelectionsportland.org");
    expect(decoded.firstName).toEqual("Government");
    expect(decoded.lastName).toEqual("Admin");
    expect(decoded.permissions.length).toEqual(1);
    expect(decoded.permissions[0].role).toEqual("government_admin");
    expect(decoded.permissions[0].type).toEqual("government");
  });

  it("login govadmin success", async () => {
    const response = await api.login(
      "govadmin@openelectionsportland.org",
      "password"
    );
    govAdminToken = response.headers
      .get("set-cookie")
      .match(/=([a-zA-Z0-9].+); Path/)[1];
    expect(govAdminToken).toBeDefined();
  });

  it("login campaignadmin success", async () => {
    const response = await api.login(
      "campaignadmin@openelectionsportland.org",
      "password"
    );
    campaignAdminToken = response.headers
      .get("set-cookie")
      .match(/=([a-zA-Z0-9].+); Path/)[1];
    expect(campaignAdminToken).toBeDefined();
  });

  it("login campaignstaff success1", async () => {
    const response = await api.login(
      "campaignstaff@openelectionsportland.org",
      "password"
    );
    campaignStaffToken = response.headers
      .get("set-cookie")
      .match(/=([a-zA-Z0-9].+); Path/)[1];
    expect(campaignStaffToken).toBeDefined();
  });

  it("login fail", async () => {
    const response = await api.login(
      "govadmin@openelectionsportland.org",
      "password1"
    );
    expect(response.status).toEqual(401);
  });

  it("me", async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.me();
    expect(response.email).toEqual("govadmin@openelectionsportland.org");
    expect(response.firstName).toEqual("Government");
    expect(response.lastName).toEqual("Admin");
    expect(response.permissions.length).toEqual(1);
    expect(response.permissions[0].role).toEqual("government_admin");
    expect(response.permissions[0].type).toEqual("government");
    governmentId = response.permissions[0].id;
    process.env.TOKEN = null;
  });

  it("inviteUsertoGovernment", async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.inviteUsertoGovernment(
      "govadmin1@openelectionsportland.org",
      "Government2",
      "Admin2",
      governmentId
    );
    expect(response.status).toEqual(201);
    process.env.TOKEN = null;
  });

  it("inviteUsertoCampaign as govAdmin", async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.inviteUsertoCampaign(
      "campaignadmin1@openelectionsportland.org",
      "Government2",
      "Admin2",
      campaignId,
      UserRoleEnum.CAMPAIGN_STAFF
    );
    expect(response.status).toEqual(201);
    process.env.TOKEN = null;
  });

  it("inviteUsertoCampaign as campaignAdmin", async () => {
    process.env.TOKEN = campaignAdminToken;
    const response = await api.inviteUsertoCampaign(
      "campaignadmin2@openelectionsportland.org",
      "Government2",
      "Admin2",
      campaignId,
      UserRoleEnum.CAMPAIGN_ADMIN
    );
    expect(response.status).toEqual(201);
    process.env.TOKEN = null;
  });

  it("redeemInvite", async () => {
    let response = await api.redeemInvite("inviteme", "password");
    expect(response.status).toEqual(204);
  });

  it("getCampaignUsers", async () => {
    process.env.TOKEN = campaignAdminToken;
    const response = await api.getCampaignUsers(campaignId);
    expect(response.length > 1).toBeTruthy();
    process.env.TOKEN = null;
  });

  it("getGovernmentUsers", async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.getGovernmentUsers(governmentId);
    expect(response.length > 1).toBeTruthy();
  });

  it("sendPasswordResetEmail", async () => {
    const response = await api.sendPasswordResetEmail(
      "campaignstaff@openelectionsportland.org"
    );
    expect(response.status).toEqual(204);
  });

  it("resetPassword", async () => {
    const response = await api.resetPassword("resetme", "newpassword");

    expect(response.status).toEqual(204);
  });

  it("updatePassword", async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.updatePassword("password", "newpassword");
    expect(response.status).toEqual(204);
  });

  it("createCampaignForGovernment", async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.createCampaignForGovernment(
      {
        governmentId,
        name: "Test for Mayor",
        officeSought: 'Mayor',
      }
    );
    expect(response.status).toEqual(201);
  });

  it("getCampaignsForGovernment", async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.getCampaignsForGovernment(governmentId);
    expect(response.length > 1).toBeTruthy();
  });

  it("getGovernmentActivities", async () => {
    process.env.TOKEN = govAdminToken;
    const response = await api.getGovernmentActivities(governmentId);
    expect(response.length > 1).toBeTruthy();
  });

  it("getCampaignActivities", async () => {
    process.env.TOKEN = campaignAdminToken;
    const response = await api.getCampaignActivities(campaignId);
    expect(response.length > 1).toBeTruthy();
  });

  it("createContribution", async () => {
    process.env.TOKEN = campaignStaffToken;
    const response = await api.createContribution({
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
    });
    expect(response.status).toEqual(201);
  });

  it("updateContribution", async () => {
    process.env.TOKEN = campaignStaffToken;
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
    const response = await api.updateContribution({
      id,
      firstName: "Ian",
      currentUserId: campaignStaffId
    });
    expect(response.status).toEqual(204);
  });

  it("getContributions", async () => {
    process.env.TOKEN = campaignStaffToken;
    const response = await api.getContributions({
      governmentId: governmentId,
      campaignId: campaignId,
      currentUserId: campaignAdminId
    });
    expect(response.status).toEqual(200);
  });

  it("getContributionById", async () => {
    process.env.TOKEN = campaignStaffToken;
    const contribution = await api.createContribution({
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
    });
    const { id } = await contribution.json();
    const response = await api.getContributionById({
      id,
      governmentId: governmentId,
      campaignId: campaignId,
      currentUserId: campaignAdminId
    });
    expect(response.status).toEqual(200);
  });
});
