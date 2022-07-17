import jwtDecode from 'jwt-decode';
import { parseFromTimeZone, convertToTimeZone } from 'date-fns-timezone';
import { format } from 'date-fns';

export const UserRoleEnum = Object.freeze({
  GOVERNMENT_ADMIN: 'government_admin',
  CAMPAIGN_ADMIN: 'campaign_admin',
  CAMPAIGN_STAFF: 'campaign_staff',
});

export const ContributionTypeEnum = Object.freeze({
  CONTRIBUTION: 'contribution',
  OTHER: 'other',
});

export const ContributionTypeFieldEnum = Object.freeze({
  CONTRIBUTION: 'Contribution',
  OTHER: 'Other Receipt',
});

export const DataToContributionTypeFieldMap = new Map([
  [ContributionTypeEnum.CONTRIBUTION, ContributionTypeFieldEnum.CONTRIBUTION],
  [ContributionTypeEnum.OTHER, ContributionTypeFieldEnum.OTHER],
]);

export const ContributionTypeFieldToDataMap = new Map([
  [ContributionTypeFieldEnum.CONTRIBUTION, ContributionTypeEnum.CONTRIBUTION],
  [ContributionTypeFieldEnum.OTHER, ContributionTypeEnum.OTHER],
]);

export const ContributionSubTypeEnum = Object.freeze({
  CASH: 'cash',
  INKIND_CONTRIBUTION: 'inkind_contribution',
  INKIND_PAID_SUPERVISION: 'inkind_paid_supervision',
  INKIND_FORGIVEN_ACCOUNT: 'inkind_forgiven_account',
  INKIND_FORGIVEN_PERSONAL: 'inkind_forgiven_personal',
  ITEM_SOLD_FAIR_MARKET: 'item_sold_fair_market',
  ITEM_RETURNED_CHECK: 'item_returned_check',
  ITEM_MISC: 'item_misc',
  ITEM_REFUND: 'item_refund',
});

export const ContributionSubTypeFieldEnum = Object.freeze({
  ITEM_SOLD_FAIR_MARKET: 'Items Sold at Fair Market Value',
  LOST_RETURNED_CHECK: 'Lost or Returned Check',
  MISC_OTHER_RECEIPT: 'Miscellaneous Other Receipt',
  REFUND_REBATES: 'Refunds and Rebates',
  INKIND_CONTRIBUTION: 'In-Kind Contribution',
  INKIND_FORGIVEN_ACCOUNT: 'In-Kind Forgiven Accounts Payable',
  INKIND_FORGIVEN_PERSONAL: 'In-Kind /Forgiven Personal Expenditure',
  CASH_CONTRIBUTION: 'Cash Contribution',
});

export const InKindDescriptionTypeEnum = Object.freeze({
  WAGES: 'wages',
  BROADCAST: 'broadcast_advertising',
  FUNDRAISING: 'fundraising_event_expenses',
  GENERAL_OPERATING: 'general_operating_expenses',
  PRINTING: 'printing',
  MANAGEMENT: 'management',
  NEWSPAPER: 'print_advertising',
  OTHER_AD: 'other_advertising',
  PETITION: 'petition_circulators',
  POSTAGE: 'postage',
  PREP_AD: 'preparation_of_advertising',
  POLLING: 'surveys_and_polls',
  TRAVEL: 'travel_expenses',
  UTILITIES: 'utilities',
});

export const DataToContributionSubTypeFieldMap = new Map([
  [
    ContributionSubTypeEnum.CASH,
    ContributionSubTypeFieldEnum.CASH_CONTRIBUTION,
  ],
  [
    ContributionSubTypeEnum.INKIND_CONTRIBUTION,
    ContributionSubTypeFieldEnum.INKIND_CONTRIBUTION,
  ],
  [
    ContributionSubTypeEnum.INKIND_FORGIVEN_ACCOUNT,
    ContributionSubTypeFieldEnum.INKIND_FORGIVEN_ACCOUNT,
  ],
  [
    ContributionSubTypeEnum.INKIND_FORGIVEN_PERSONAL,
    ContributionSubTypeFieldEnum.INKIND_FORGIVEN_PERSONAL,
  ],
  [
    ContributionSubTypeEnum.ITEM_SOLD_FAIR_MARKET,
    ContributionSubTypeFieldEnum.ITEM_SOLD_FAIR_MARKET,
  ],
  [
    ContributionSubTypeEnum.ITEM_RETURNED_CHECK,
    ContributionSubTypeFieldEnum.LOST_RETURNED_CHECK,
  ],
  [
    ContributionSubTypeEnum.ITEM_MISC,
    ContributionSubTypeFieldEnum.MISC_OTHER_RECEIPT,
  ],
  [
    ContributionSubTypeEnum.ITEM_REFUND,
    ContributionSubTypeFieldEnum.REFUND_REBATES,
  ],
]);

export const ContributionSubTypeFieldToDataMap = new Map([
  [
    ContributionSubTypeFieldEnum.CASH_CONTRIBUTION,
    ContributionSubTypeEnum.CASH,
  ],
  [
    ContributionSubTypeFieldEnum.INKIND_CONTRIBUTION,
    ContributionSubTypeEnum.INKIND_CONTRIBUTION,
  ],
  [
    ContributionSubTypeFieldEnum.INKIND_FORGIVEN_ACCOUNT,
    ContributionSubTypeEnum.INKIND_FORGIVEN_ACCOUNT,
  ],
  [
    ContributionSubTypeFieldEnum.INKIND_FORGIVEN_PERSONAL,
    ContributionSubTypeEnum.INKIND_FORGIVEN_PERSONAL,
  ],
  [
    ContributionSubTypeFieldEnum.ITEM_SOLD_FAIR_MARKET,
    ContributionSubTypeEnum.ITEM_SOLD_FAIR_MARKET,
  ],
  [
    ContributionSubTypeFieldEnum.LOST_RETURNED_CHECK,
    ContributionSubTypeEnum.ITEM_RETURNED_CHECK,
  ],
  [
    ContributionSubTypeFieldEnum.MISC_OTHER_RECEIPT,
    ContributionSubTypeEnum.ITEM_MISC,
  ],
  [
    ContributionSubTypeFieldEnum.REFUND_REBATES,
    ContributionSubTypeEnum.ITEM_REFUND,
  ],
]);

export const ContributorTypeEnum = Object.freeze({
  INDIVIDUAL: 'individual',
  BUSINESS: 'business',
  FAMILY: 'family',
  LABOR: 'labor',
  POLITICAL_COMMITTEE: 'political_committee',
  POLITICAL_PARTY: 'political_party',
  UNREGISTERED: 'unregistered',
  OTHER: 'other',
});

export const ContributorTypeFieldEnum = Object.freeze({
  BUSINESS_ENTITY: 'Business Entity',
  LABOR_ORGANIZATION: 'Labor Organization',
  POLITICAL_COMMITTEE: 'Political Committee',
  POLITICAL_PARTY_COMMITEE: 'Political Party Committee',
  UNREGISTERED_COMMITTEE: 'Unregistered Committee',
  INDIVIDUAL: 'Individual',
  CANDIDATE_IMMEDIATE_FAMILY: 'Candidate’s Immediate Family',
  OTHER: 'Other',
});

export const DataToContributorTypeFieldMap = new Map([
  [ContributorTypeEnum.INDIVIDUAL, ContributorTypeFieldEnum.INDIVIDUAL],
  [ContributorTypeEnum.BUSINESS, ContributorTypeFieldEnum.BUSINESS_ENTITY],
  [
    ContributorTypeEnum.FAMILY,
    ContributorTypeFieldEnum.CANDIDATE_IMMEDIATE_FAMILY,
  ],
  [ContributorTypeEnum.LABOR, ContributorTypeFieldEnum.LABOR_ORGANIZATION],
  [
    ContributorTypeEnum.POLITICAL_COMMITTEE,
    ContributorTypeFieldEnum.POLITICAL_COMMITTEE,
  ],
  [
    ContributorTypeEnum.POLITICAL_PARTY,
    ContributorTypeFieldEnum.POLITICAL_PARTY_COMMITEE,
  ],
  [
    ContributorTypeEnum.UNREGISTERED,
    ContributorTypeFieldEnum.UNREGISTERED_COMMITTEE,
  ],
  [ContributorTypeEnum.OTHER, ContributorTypeFieldEnum.OTHER],
]);

export const ContributorTypeFieldToDataMap = new Map([
  [ContributorTypeFieldEnum.INDIVIDUAL, ContributorTypeEnum.INDIVIDUAL],
  [ContributorTypeFieldEnum.BUSINESS_ENTITY, ContributorTypeEnum.BUSINESS],
  [
    ContributorTypeFieldEnum.CANDIDATE_IMMEDIATE_FAMILY,
    ContributorTypeEnum.FAMILY,
  ],
  [ContributorTypeFieldEnum.LABOR_ORGANIZATION, ContributorTypeEnum.LABOR],
  [
    ContributorTypeFieldEnum.POLITICAL_COMMITTEE,
    ContributorTypeEnum.POLITICAL_COMMITTEE,
  ],
  [
    ContributorTypeFieldEnum.POLITICAL_PARTY_COMMITEE,
    ContributorTypeEnum.POLITICAL_PARTY,
  ],
  [
    ContributorTypeFieldEnum.UNREGISTERED_COMMITTEE,
    ContributorTypeEnum.UNREGISTERED,
  ],
  [ContributorTypeFieldEnum.OTHER, ContributorTypeEnum.OTHER],
]);

export const OaeTypeEnum = Object.freeze({
  SEED_MONEY: 'seed',
  MATCHABLE: 'matchable',
  PUBLIC_MATCHING_CONTRIBUTION: 'public_matching_contribution',
  QUALIFYING: 'qualifying',
  ALLOWABLE: 'allowable',
  INKIND: 'inkind',
  OTHER: 'other',
});

export const OaeTypeFieldEnum = Object.freeze({
  SEED_MONEY: 'Seed Money',
  MATCHABLE: 'Matchable',
  PUBLIC_MATCHING_CONTRIBUTION: 'Public Matching Contribution',
  QUALIFYING: 'Qualifying',
  ALLOWABLE: 'Allowable',
  INKIND: 'In-Kind',
  OTHER: 'Other',
});

export const DataToOaeTypeTypeFieldMap = new Map([
  [OaeTypeEnum.SEED_MONEY, OaeTypeFieldEnum.SEED_MONEY],
  [OaeTypeEnum.MATCHABLE, OaeTypeFieldEnum.MATCHABLE],
  [
    OaeTypeEnum.PUBLIC_MATCHING_CONTRIBUTION,
    OaeTypeFieldEnum.PUBLIC_MATCHING_CONTRIBUTION,
  ],
  [OaeTypeEnum.QUALIFYING, OaeTypeFieldEnum.QUALIFYING],
  [OaeTypeEnum.ALLOWABLE, OaeTypeFieldEnum.ALLOWABLE],
  [OaeTypeEnum.INKIND, OaeTypeFieldEnum.INKIND],
  [OaeTypeEnum.OTHER, OaeTypeFieldEnum.OTHER],
]);

export const OaeTypeFieldToDataMap = new Map([
  [OaeTypeFieldEnum.SEED_MONEY, OaeTypeEnum.SEED_MONEY],
  [OaeTypeFieldEnum.MATCHABLE, OaeTypeEnum.MATCHABLE],
  [
    OaeTypeFieldEnum.PUBLIC_MATCHING_CONTRIBUTION,
    OaeTypeEnum.PUBLIC_MATCHING_CONTRIBUTION,
  ],
  [OaeTypeFieldEnum.QUALIFYING, OaeTypeEnum.QUALIFYING],
  [OaeTypeFieldEnum.ALLOWABLE, OaeTypeEnum.ALLOWABLE],
  [OaeTypeFieldEnum.INKIND, OaeTypeEnum.INKIND],
]);

export const PhoneTypeEnum = Object.freeze({
  MOBILE: 'Mobile',
  WORK: 'Work',
  HOME: 'Home',
});

export const PhoneTypeFieldEnum = Object.freeze({
  MOBILE_PHONE: 'Mobile Phone',
  WORK_PHONE: 'Work Phone',
  HOME_PHONE: 'Home Phone',
});

export const PaymentMethodEnum = Object.freeze({
  CASH: 'cash',
  CHECK: 'check',
  MONEY_ORDER: 'money_order',
  CREDIT_CARD_ONLINE: 'credit_card_online',
  CREDIT_CARD_PAPER: 'credit_card_paper',
  ETF: 'electronic_funds_transfer',
  DEBIT: 'debit',
});

export const DataToPhoneTypeFieldMap = new Map([
  [PhoneTypeEnum.MOBILE, PhoneTypeFieldEnum.MOBILE_PHONE],
  [PhoneTypeEnum.WORK, PhoneTypeFieldEnum.WORK_PHONE],
  [PhoneTypeEnum.HOME, PhoneTypeFieldEnum.HOME_PHONE],
]);

export const PhoneTypeFieldToDataMap = new Map([
  [PhoneTypeFieldEnum.MOBILE_PHONE, PhoneTypeEnum.MOBILE],
  [PhoneTypeFieldEnum.HOME_PHONE, PhoneTypeEnum.HOME_PHONE],
  [PhoneTypeFieldEnum.WORK_PHONE, PhoneTypeEnum.WORK],
]);

export const ContributionStatusEnum = Object.freeze({
  ARCHIVED: 'Archived',
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  PROCESSED: 'Processed',
  AWAITING: 'Awaiting',
});

export const ExpenditureTypeEnum = Object.freeze({
  EXPENDITURE: 'expenditure',
  OTHER: 'other',
  OTHER_DISBURSEMENT: 'other_disbursement',
});

export const ExpenditureSubTypeEnum = Object.freeze({
  ACCOUNTS_PAYABLE: 'accounts_payable',
  CASH_EXPENDITURE: 'cash_expenditure',
  PERSONAL_EXPENDITURE: 'personal_expenditure',
  ACCOUNTS_PAYABLE_RESCINDED: 'accounts_payable_rescinded',
  CASH_BALANCE_ADJUSTMENT: 'cash_balance_adjustment',
  MISCELLANEOUS_OTHER_DISBURSEMENT: 'miscellaneous_other_disbursement',
  REFUND_OF_CONTRIBUTION: 'refund_of_expenditure',
});

export const PayeeTypeEnum = Object.freeze({
  INDIVIDUAL: 'individual',
  BUSINESS: 'business',
  FAMILY: 'family',
  LABOR: 'labor',
  POLITICAL_COMMITTEE: 'political_committee',
  POLITICAL_PARTY: 'political_party',
  UNREGISTERED: 'unregistered',
  OTHER: 'other',
});

export const ExpenditureStatusEnum = Object.freeze({
  ARCHIVED: 'archived',
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  OUT_OF_COMPLIANCE: 'out_of_compliance',
  IN_COMPLIANCE: 'in_compliance',
});

export const PurposeTypeEnum = Object.freeze({
  WAGES: 'wages',
  CASH: 'cash_contribution',
  REIMBURSEMENT: 'personal_reimbursement',
  BROADCAST: 'broadcast_advertising',
  FUNDRAISING: 'fundraising_event_expenses',
  GENERAL_OPERATING: 'general_operating_expenses',
  PRIMTING: 'printing',
  MANAGEMENT: 'management',
  NEWSPAPER: 'print_advertising',
  OTHER_AD: 'other_advertising',
  PETITION: 'petition_circulators',
  POSTAGE: 'postage',
  PREP_AD: 'preparation_of_advertising',
  POLLING: 'surveys_and_polls',
  TRAVEL: 'travel_expenses',
  UTILITIES: 'utilities',
});

export function post(url, data) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (data.format === 'csv') {
    headers.Accept = 'text/csv';
  }

  if (process.env.NODE_ENV === 'test' && !!process.env.TOKEN) {
    headers.Cookie = `token=${process.env.TOKEN}`;
  }
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

export function deleteRequest(url) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (process.env.NODE_ENV === 'test' && !!process.env.TOKEN) {
    headers.Cookie = `token=${process.env.TOKEN}`;
  }
  return fetch(url, {
    method: 'DELETE',
    headers,
    credentials: 'include',
  });
}

export function get(url) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (process.env.NODE_ENV === 'test' && !!process.env.TOKEN) {
    headers.Cookie = `token=${process.env.TOKEN}`;
  }
  return fetch(url, {
    method: 'GET',
    headers,
    credentials: 'include',
  });
}

export function put(url, data) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (process.env.NODE_ENV === 'test' && !!process.env.TOKEN) {
    headers.Cookie = `token=${process.env.TOKEN}`;
  }
  return fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

export function decodeToken(token) {
  return jwtDecode(token);
}

export function baseUrl(isDataVisualizationRequest = false) {
  if (process.env.NODE_ENV === 'test') {
    return 'http://localhost:3000';
  }

  if (window && window.location.hostname.includes('qa')) {
    return 'https://api-qa.openelectionsportland.org';
  }

  if (process.env.NODE_ENV === 'development' && !isDataVisualizationRequest) {
    return 'http://localhost:3000';
  }

  return 'https://api.openelectionsportland.org';
}

// returns the jwt session token
export function login(email, password) {
  return post(`${baseUrl()}/users/login`, { email, password });
}

// returns the jwt session token
export function me() {
  return get(`${baseUrl()}/me`).then(response => response.json());
}

export function dateToPickerFormat(date) {
  return date !== null && date !== ''
    ? format(
        parseFromTimeZone(date, {
          timeZone: 'America/Los_Angeles',
        }),
        'yyyy-MM-dd'
      )
    : '';
}

export function dateToMicroTime(formatedDate) {
  return new Date(
    convertToTimeZone(formatedDate, {
      timeZone: 'America/Los_Angeles',
    })
  ).getTime();
}

export function inviteUsertoGovernment(
  email,
  firstName,
  lastName,
  governmentId
) {
  return post(`${baseUrl()}/users/invite`, {
    email,
    firstName,
    lastName,
    governmentId,
    role: UserRoleEnum.GOVERNMENT_ADMIN,
  });
}

export function inviteUsertoCampaign(
  email,
  firstName,
  lastName,
  campaignId,
  role
) {
  return post(`${baseUrl()}/users/invite`, {
    email,
    firstName,
    lastName,
    campaignId,
    role,
  });
}

export function resendInvite(userId) {
  return post(`${baseUrl()}/users/resend-invite`, { userId });
}

export function removePermission(permissionId) {
  return deleteRequest(`${baseUrl()}/permissions/${permissionId}`);
}

export function redeemInvite(invitationCode, password, firstName, lastName) {
  const data = {
    invitationCode,
    password,
    firstName,
    lastName,
  };

  return post(`${baseUrl()}/users/redeem-invite`, data);
}

export function getCampaignUsers(campaignId) {
  return post(`${baseUrl()}/users`, { campaignId }).then(response =>
    response.json()
  );
}

export function getGovernmentUsers(governmentId) {
  return post(`${baseUrl()}/users`, { governmentId }).then(response =>
    response.json()
  );
}

//   path: '/users/send-password-reset-email',
//   method: 'post',
export function sendPasswordResetEmail(email) {
  return post(`${baseUrl()}/users/send-password-reset-email`, { email });
}

//   path: '/users/reset-password',
//   method: 'post',
export function resetPassword(invitationCode, password) {
  return post(`${baseUrl()}/users/reset-password`, {
    invitationCode,
    password,
  });
}

//   path: '/users/password',
//   method: 'put',
export function updatePassword(currentPassword, newPassword) {
  return put(`${baseUrl()}/users/password`, { currentPassword, newPassword });
}

//   path: '/activities',
//   method: 'post',
export function getCampaignActivities(activitiesAttrs) {
  return post(`${baseUrl()}/activities`, activitiesAttrs).then(response =>
    response.json()
  );
}

export function getGovernmentActivities(activitiesAttrs) {
  return post(`${baseUrl()}/activities`, activitiesAttrs).then(response =>
    response.json()
  );
}

export function getContributionActivities(activitiesAttrs) {
  return post(`${baseUrl()}/activities`, activitiesAttrs).then(response =>
    response.json()
  );
}

export function getExpenditureActivities(activitiesAttrs) {
  return post(`${baseUrl()}/activities`, activitiesAttrs).then(response =>
    response.json()
  );
}

//   path: '/campaigns',
//   method: 'post',
export function getCampaignsForGovernment(governmentId) {
  return post(`${baseUrl()}/campaigns`, { governmentId }).then(response =>
    response.json()
  );
}

//   path: '/campaigns/new',
//   method: 'post',
export function createCampaignForGovernment(campaignAttrs) {
  return post(`${baseUrl()}/campaigns/new`, campaignAttrs);
}

//   path: '/campaigns/update',
//   method: 'post',
export function updateCampaignNameForGovernment(campaignAttrs) {
  return post(`${baseUrl()}/campaigns/update`, campaignAttrs).then(response =>
    response.json()
  );
}

// path: '/contributions/:id'
//   method: 'put',
export function updateContribution(contributionAttrs) {
  return put(
    `${baseUrl()}/contributions/${contributionAttrs.id}`,
    contributionAttrs
  );
}

//   path: '/contributions/new',
//   method: 'post',
export function createContribution(contributionAttrs) {
  return post(`${baseUrl()}/contributions/new`, contributionAttrs);
}

//   path: '/contributions',
//   method: 'post',
export function getContributions(contributionSearchAttrs) {
  return post(`${baseUrl()}/contributions`, contributionSearchAttrs);
}

//   path: '/contributions/:id/comments',
//   method: 'post',
export function postContributionComment(contributionId, comment, attachment) {
  const formData = new FormData();
  if (attachment) {
    formData.append('attachment', attachment);
  }
  formData.append('comment', comment);
  return fetch(`${baseUrl()}/contributions/${contributionId}/comments`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
}

//   path: '/contributions/{id}',
//   method: 'post',
export function getContributionById(id) {
  return get(`${baseUrl()}/contributions/${id}`);
}

//   path: '/contributions/{id}',
//   method: 'delete',
export function archiveContribution(id) {
  return deleteRequest(`${baseUrl()}/contributions/${id}`);
}

//   path: '/expenditures/new',
//   method: 'post',
export function createExpenditure(expenditureAttrs) {
  return post(`${baseUrl()}/expenditures/new`, expenditureAttrs);
}

//   path: '/expenditures/:id/comments',
//   method: 'post',
export function postExpenditureComment(expenditureId, comment, attachment) {
  const formData = new FormData();
  if (attachment) {
    formData.append('attachment', attachment);
  }
  formData.append('comment', comment);
  return fetch(`${baseUrl()}/expenditures/${expenditureId}/comments`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
}

//   path: '/expenditures',
//   method: 'post',
export function getExpenditures(expenditureSearchAttrs) {
  return post(`${baseUrl()}/expenditures`, expenditureSearchAttrs);
}

//   path: '/expenditures/:id',
//   method: 'get',
export function getExpenditureById(id) {
  return get(`${baseUrl()}/expenditures/${id}`);
}

// path: '/expenditures/:id'
//   method: 'put',
export function updateExpenditure(expenditureAttrs) {
  return put(
    `${baseUrl()}/expenditures/${expenditureAttrs.id}`,
    expenditureAttrs
  );
}

// path: '/summary'
//   method: 'post',
// summaryArttrs = {governmentId: integer OR campaignId: integer}
export function getStatusSummary(summaryAttrs) {
  return post(`${baseUrl()}/summary`, summaryAttrs);
}

// path '/matches/:id'
// method: 'get'
export function getMatchesByContributionId(id) {
  return get(`${baseUrl()}/matches/${id}`);
}

/*
path '/matches'
method: 'post'
@attrs {
contributionId: number,
matchId: string,
matchStrength: enum[exact, strong, weak, none]
 }
 */
export function updateMatchForContribution(attrs) {
  return post(`${baseUrl()}/matches`, attrs);
}

export function getContributionGeoData() {
  return get(`${baseUrl(true)}/contributionsgeo`).then(response =>
    response.json()
  );
}

export function getExternalContributionGeoData() {
  return get(`${baseUrl()}/external-contributionsgeo`).then(response =>
    response.json()
  );
}
