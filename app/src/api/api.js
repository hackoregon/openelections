import jwtDecode from "jwt-decode";

export const UserRoleEnum = Object.freeze({
  GOVERNMENT_ADMIN: "government_admin",
  CAMPAIGN_ADMIN: "campaign_admin",
  CAMPAIGN_STAFF: "campaign_staff"
});

export const ContributionTypeEnum = Object.freeze({
  CONTRIBUTION: "contribution",
  OTHER: "other"
});

export const ContributionTypeFieldEnum = Object.freeze({
  CONTRIBUTION: "Contribution", 
  OTHER: "Other Receipt"
})

export const DataToContributionTypeFieldMap = new Map([
  [ContributionTypeEnum.CONTRIBUTION, ContributionTypeFieldEnum.CONTRIBUTION],
  [ContributionTypeEnum.OTHER, ContributionTypeFieldEnum.OTHER]
])

export const ContributionTypeFieldToDateMap = new Map([
  [ContributionTypeFieldEnum.CONTRIBUTION, ContributionTypeEnum.CONTRIBUTION],
  [ContributionTypeFieldEnum.OTHER, ContributionTypeEnum.OTHER]
])

export const ContributionSubTypeEnum = Object.freeze({
  CASH: "cash",
  INKIND_CONTRIBUTION: "inkind_contribution",
  INKIND_PAID_SUPERVISION: "inkind_paid_supervision",
  INKIND_FORGIVEN_ACCOUNT: "inkind_forgiven_account",
  INKIND_FORGIVEN_PERSONAL: "inkind_forgiven_personal",
  ITEM_SOLD_FAIR_MARKET: "item_sold_fair_market",
  ITEM_RETURNED_CHECK: "item_returned_check",
  ITEM_MISC: "item_misc",
  ITEM_REFUND: "item_refund"
});

export const ContributionSubTypeFieldEnum = Object.freeze({
  ITEM_SOLD_FAIR_MARKET: "Items Sold at Fair Market Value", 
  LOST_RETURNED_CHECK: "Lost or Returned Check", 
  MISC_OTHER_RECEIPT: "Miscellaneous Other Receipt", 
  REFUND_REBATES: "Refunds and Rebates",
  INKIND_CONTRIBUTION: "In-Kind Contribution",
  INKIND_FORGIVEN_ACCOUNT: "In-Kind Forgiven Accounts Payable",
  INKIND_FORGIVEN_PERSONAL: "In-Kind /Forgiven Personal Expenditure",
  CASH_CONTRIBUTION: "Cash Contribution"
})

export const DataToContributionSubTypeFieldMap = new Map([
  [ContributionSubTypeEnum.CASH, ContributionSubTypeFieldEnum.CASH_CONTRIBUTION],
  [ContributionSubTypeEnum.INKIND_CONTRIBUTION, ContributionSubTypeFieldEnum.INKIND_CONTRIBUTION],
  [ContributionSubTypeEnum.INKIND_FORGIVEN_ACCOUNT, ContributionSubTypeFieldEnum.INKIND_FORGIVEN_ACCOUNT],
  [ContributionSubTypeEnum.INKIND_FORGIVEN_PERSONAL, ContributionSubTypeFieldEnum.INKIND_FORGIVEN_PERSONAL],
  [ContributionSubTypeEnum.ITEM_SOLD_FAIR_MARKET, ContributionSubTypeFieldEnum.ITEM_SOLD_FAIR_MARKET],
  [ContributionSubTypeEnum.ITEM_RETURNED_CHECK, ContributionSubTypeFieldEnum.LOST_RETURNED_CHECK],
  [ContributionSubTypeEnum.ITEM_MISC, ContributionSubTypeFieldEnum.MISC_OTHER_RECEIPT],
  [ContributionSubTypeEnum.ITEM_REFUND, ContributionSubTypeFieldEnum.REFUND_REBATES]
])

export const ContributionSubTypeFieldToDataMap = new Map([
  [ContributionSubTypeFieldEnum.CASH_CONTRIBUTION, ContributionSubTypeEnum.CASH],
  [ContributionSubTypeFieldEnum.INKIND_CONTRIBUTION, ContributionSubTypeEnum.INKIND_CONTRIBUTION],
  [ContributionSubTypeFieldEnum.INKIND_FORGIVEN_ACCOUNT, ContributionSubTypeEnum.INKIND_FORGIVEN_ACCOUNT],
  [ContributionSubTypeFieldEnum.INKIND_FORGIVEN_PERSONAL, ContributionSubTypeEnum.INKIND_FORGIVEN_PERSONAL],
  [ContributionSubTypeFieldEnum.ITEM_SOLD_FAIR_MARKET, ContributionSubTypeEnum.ITEM_SOLD_FAIR_MARKET],
  [ContributionSubTypeFieldEnum.LOST_RETURNED_CHECK, ContributionSubTypeEnum.ITEM_RETURNED_CHECK],
  [ContributionSubTypeFieldEnum.MISC_OTHER_RECEIPT, ContributionSubTypeEnum.ITEM_MISC],
  [ContributionSubTypeFieldEnum.REFUND_REBATES, ContributionSubTypeEnum.ITEM_REFUND]
])

export const ContributorTypeEnum = Object.freeze({
  INDIVIDUAL: "individual",
  BUSINESS: "business",
  FAMILY: "family",
  LABOR: "labor",
  POLITICAL_COMMITTEE: "political_committee",
  POLITICAL_PARTY: "political_party",
  UNREGISTERED: "unregistered",
  OTHER: "other"
});

export const ContributorTypeFieldEnum = Object.freeze({
  BUSINESS_ENTITY: "Business Entity",
  LABOR_ORGANIZATION: "Labor Organization",
  POLITICAL_COMMITTEE: "Political Committee",
  POLITICAL_PARTY_COMMITEE: "Political Party Committee",
  UNREGISTERED_COMMITTEE: "Unregistered Committee",
  INDIVIDUAL: "Individual",
  CANDIDATE_IMMEDIATE_FAMILY: "Candidate’s Immediate Family",
  OTHER: "Other"
})

export const DataToContributorTypeFieldEnum = new Map([
  [ContributorTypeEnum.INDIVIDUAL, ContributorTypeFieldEnum.INDIVIDUAL],
  [ContributorTypeEnum.BUSINESS, ContributorTypeFieldEnum.BUSINESS_ENTITY],
  [ContributorTypeEnum.FAMILY, ContributorTypeFieldEnum.CANDIDATE_IMMEDIATE_FAMILY],
  [ContributorTypeEnum.LABOR, ContributorTypeFieldEnum.LABOR_ORGANIZATION],
  [ContributorTypeEnum.POLITICAL_COMMITTEE, ContributorTypeFieldEnum.POLITICAL_COMMITTEE],
  [ContributorTypeEnum.POLITICAL_PARTY, ContributorTypeFieldEnum.POLITICAL_PARTY_COMMITEE],
  [ContributorTypeEnum.UNREGISTERED, ContributorTypeFieldEnum.UNREGISTERED_COMMITTEE],
  [ContributorTypeEnum.OTHER, ContributorTypeFieldEnum.OTHER],
])

export const ContributorTypeFieldEnumToDataMap = new Map([
  [ContributorTypeFieldEnum.INDIVIDUAL, ContributorTypeEnum.INDIVIDUAL],
  [ContributorTypeFieldEnum.BUSINESS_ENTITY, ContributorTypeEnum.BUSINESS],
  [ContributorTypeFieldEnum.CANDIDATE_IMMEDIATE_FAMILY, ContributorTypeEnum.FAMILY],
  [ContributorTypeFieldEnum.LABOR_ORGANIZATION, ContributorTypeEnum.LABOR,],
  [ContributorTypeFieldEnum.POLITICAL_COMMITTEE, ContributorTypeEnum.POLITICAL_COMMITTEE,],
  [ContributorTypeFieldEnum.POLITICAL_PARTY_COMMITEE, ContributorTypeEnum.POLITICAL_PARTY,],
  [ContributorTypeFieldEnum.UNREGISTERED_COMMITTEE, ContributorTypeEnum.UNREGISTERED,],
  [ContributorTypeFieldEnum.OTHER, ContributorTypeEnum.OTHER,],
])

export const PhoneTypeEnum = Object.freeze({
  MOBILE: "Mobile",
  WORK: "Work",
  HOME: "Home"
})

export const ContactTypeFieldEnum = Object.freeze({
  MOBILE_PHONE: "Mobile Phone",
  WORK_PHONE: "Work Phone", 
  EXTENSION: "Extension", 
  HOME_PHONE: "Home Phone", 
  FAX: "Fax", 
  EMAIL: "Email address"
})

export const DataToContactTypeFieldMap = new Map([
  [PhoneTypeEnum.MOBILE, ContactTypeFieldEnum.MOBILE_PHONE],
  [PhoneTypeEnum.WORK, ContactTypeFieldEnum.WORK_PHONE],
  [PhoneTypeEnum.HOME, ContactTypeFieldEnum.HOME_PHONE],
])

export const ContactTypeFieldToDataMap = new Map([
  [ContactTypeFieldEnum.MOBILE_PHONE, PhoneTypeEnum.MOBILE],
  [ContactTypeFieldEnum.HOME_PHONE, PhoneTypeEnum.HOME_PHONE],
  [ContactTypeFieldEnum.WORK_PHONE, PhoneTypeEnum.WORK],
  [ContactTypeFieldEnum.EXTENSION, PhoneTypeEnum.WORK],
  [ContactTypeFieldEnum.FAX, PhoneTypeEnum.WORK],
])

export const ContributionStatusEnum = Object.freeze({
  ARCHIVED: "Archived",
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  PROCESSED: "Processed"
});

export function baseUrl() {
  if (process.env.NODE_ENV === "test") {
    return "http://localhost:3000";
  } else if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  } else if (process.env.NODE_ENV === "staging") {
    return "https://api-qa.openelectionsportland.org";
  } else if (process.env.NODE_ENV === "production") {
    //Todo: Change for production
    //return "https://api.openelectionsportland.org";
    return "https://api-qa.openelectionsportland.org";
  }
}

// returns the jwt session token
export function login(email, password) {
  return post(`${baseUrl()}/users/login`, { email, password });
}

// returns the jwt session token
export function me() {
  return get(`${baseUrl()}/me`).then(response => response.json());
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
    role: UserRoleEnum.GOVERNMENT_ADMIN
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
    role
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
    lastName
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
    password
  });
}

//   path: '/users/password',
//   method: 'put',
export function updatePassword(currentPassword, newPassword) {
  return put(`${baseUrl()}/users/password`, { currentPassword, newPassword });
}

//   path: '/activities',
//   method: 'post',
export function getCampaignActivities(campaignId) {
  return post(`${baseUrl()}/activities`, { campaignId }).then(response =>
    response.json()
  );
}

export function getGovernmentActivities(governmentId) {
  return post(`${baseUrl()}/activities`, { governmentId }).then(response =>
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

export function post(url, data) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  if (process.env.NODE_ENV === "test" && !!process.env.TOKEN) {
    headers["Cookie"] = `token=${process.env.TOKEN}`;
  }
  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
    credentials: "include"
  });
}

export function deleteRequest(url) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  if (process.env.NODE_ENV === "test" && !!process.env.TOKEN) {
    headers["Cookie"] = `token=${process.env.TOKEN}`;
  }
  return fetch(url, {
    method: "DELETE",
    headers,
    credentials: "include"
  });
}

export function get(url) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  if (process.env.NODE_ENV === "test" && !!process.env.TOKEN) {
    headers["Cookie"] = `token=${process.env.TOKEN}`;
  }
  return fetch(url, {
    method: "GET",
    headers: headers,
    credentials: "include"
  });
}

export function put(url, data) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  if (process.env.NODE_ENV === "test" && !!process.env.TOKEN) {
    headers["Cookie"] = `token=${process.env.TOKEN}`;
  }
  return fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
    credentials: "include"
  });
}

export function decodeToken(token) {
  return jwtDecode(token);
}
