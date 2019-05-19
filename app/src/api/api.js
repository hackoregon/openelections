import jwtDecode from "jwt-decode";

export const UserRoleEnum = Object.freeze({
  "GOVERNMENT_ADMIN": "government_admin",
  "CAMPAIGN_ADMIN": "campaign_admin",
  "CAMPAIGN_STAFF": "campaign_staff"
});

export function baseUrl() {
  if (process.env.NODE_ENV === "test") {
    return "http://localhost:3000";
  } else if (process.env.NODE_ENV === "develop") {
    return "http://localhost:3000";
  } else if (process.env.NODE_ENV === "staging") {
    return "https://api.qa.openelectinosports.org";
  } else if (process.env.NODE_ENV === "production") {
    return "https://api.openelectinosports.org";
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

export function inviteUsertoGovernment(email, firstName, lastName, governmentId) {
  return post(`${baseUrl()}/users/invite`, { email, firstName, lastName, governmentId, role: UserRoleEnum.GOVERNMENT_ADMIN});
}

export function inviteUsertoCampaign(email, firstName, lastName, campaignId, role) {
  return post(`${baseUrl()}/users/invite`, { email, firstName, lastName, campaignId, role});
}

export function resendInvite(userId) {
  return post(`${baseUrl()}/users/resend-invite`, { userId });
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
  return post(`${baseUrl()}/users`, {campaignId}).then( response => response.json());
}

export function getGovernmentUsers(governmentId) {
  return post(`${baseUrl()}/users`, {governmentId}).then( response => response.json());
}

export function post(url, data) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
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

export function get(url) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (process.env.NODE_ENV === "test" && !!process.env.TOKEN) {
    headers["Cookie"] = `token=${process.env.TOKEN}`;
  }
  return fetch(url, {
    method: "GET",
    headers: headers,
    credentials: "include"
  });
}

export function decodeToken(token) {
  return jwtDecode(token);
}

//   path: '/users',
//   method: 'post',
//   path: '/users/send-password-reset-email',
//   method: 'post',
//   path: '/users/reset-password',
//   method: 'post',
//   path: '/users/password',
//   method: 'put',
//   path: '/activities',
//   method: 'post',
