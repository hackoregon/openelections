import { getPermissionsByCampaignIdAsync, IUserPermission, UserRole } from '../models/entity/Permission';
import { ActivityTypeEnum, getActivityByCampaignByTimeAsync, IShortActivityResult } from '../models/entity/Activity';

const AWS = require('aws-sdk');

export interface ISESEmailParams {
  Destination: {
    ToAddresses: string[],
    CcAddresses?: string[],
  };
  Message: {
    Body: {
      Html: {
        Charset: string,
          Data: string
      };
      Text: {
        Charset: 'UTF-8',
          Data: string
      }
    };
    Subject: {
      Charset: 'UTF-8',
        Data: string
    }
  };
  Source: string;
  ReplyToAddresses?: string[];
}

export interface ISendNewUserInvitationEmailAttrs {
  to: string;
  campaignName?: string;
  governmentName?: string;
  invitationCode: string;
}

export async function sendNewUserInvitationEmail(params: ISendNewUserInvitationEmailAttrs) {
  const host = process.env.HOST_URL || 'http://localhost:3000';
  const email: ISESEmailParams = {
    Destination: {
      ToAddresses: [params.to]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<html><head><body><p>You've been invited to join the ${params.campaignName || params.governmentName || 'Open Elections Program'}</p><p><a href="${host}/invitation?email=${params.to}${params.campaignName ? '&campaign=' + params.campaignName : ''}${params.governmentName ? '&government=' + params.governmentName : ''}&invitationCode=${params.invitationCode}">Click here to accept invitation.</a></p></body></head>`
        },
        Text: {
          Charset: 'UTF-8',
          Data: `You've been invited to join the ${params.campaignName || params.governmentName || 'Open Elections Program'}. Please visit ${host}/invitation?email=${params.to}${params.campaignName ? '&campaign=' + params.campaignName : ''}${params.governmentName ? '&government=' + params.governmentName : ''}&invitationCode=${params.invitationCode} to accept the invitation`
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `You've been invited to ${params.campaignName || params.governmentName}`,
      }
    },
    Source: 'no-reply@openelectionsportland.org',
  };
  return sendEmail(email);
}

export interface IResendInvitationEmailAttrs {
  to: string;
  invitationCode: string;
}

export async function resendInvitationEmail(params: IResendInvitationEmailAttrs) {
  const host = process.env.HOST_URL || 'http://localhost:3000';
  const email: ISESEmailParams = {
    Destination: {
      ToAddresses: [params.to]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<html><head><body><p>You've been invited to the OpenElections Program.</p><p><a href="${host}/invitation?invitationCode=${params.invitationCode}">Click here to accept invitation.</a></p></body></head>`
        },
        Text: {
          Charset: 'UTF-8',
          Data: `You've been invited to the OpenElections Program. Please visit ${host}/invitation?invitationCode=${params.invitationCode} to accept the invitation`
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `You've been invited to the OpenElections Program.`,
      }
    },
    Source: 'no-reply@openelectionsportland.org',
  };
  return sendEmail(email);
}


export interface ISendPasswordResetEmailAttrs {
  to: string;
  invitationCode: string;
}

export async function sendPasswordResetEmail(params: ISendPasswordResetEmailAttrs) {
  const host = process.env.HOST_URL || 'http://localhost:3000';
  const email: ISESEmailParams = {
    Destination: {
      ToAddresses: [params.to]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<html><head><body><p>A password reset has been requested</p><p><a href="${host}/update-forgotten-password?invitationCode=${params.invitationCode}">Click here to reset your password.</a></p></body></head>`
        },
        Text: {
          Charset: 'UTF-8',
          Data: `A password reset has been requested. Please visit ${host}/update-forgotten-password?invitationCode=${params.invitationCode} to reset your password`
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Reset your password`,
      }
    },
    Source: 'no-reply@openelectionsportland.org',
  };
  return sendEmail(email);
}

export interface ISendInvitationEmailAttrs {
  to: string;
  campaignName?: string;
  governmentName?: string;
}

export async function sendInvitationEmail(params: ISendInvitationEmailAttrs) {
  const host = process.env.HOST_URL || 'http://localhost:3000';
  const email: ISESEmailParams = {
    Destination: {
      ToAddresses: [params.to]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<html><head><body><p>You've been invited to join the ${params.campaignName || params.governmentName}</p><p><a href="${host}">Click here to sign in.</a></p></body></head>`
        },
        Text: {
          Charset: 'UTF-8',
          Data: `You've been invited to join the ${params.campaignName || params.governmentName}. Please visit ${host} to sign in.`
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `You've been invited to ${params.campaignName || params.governmentName}`,
      }
    },
    Source: 'no-reply@openelectionsprojec.org',
  };
  return sendEmail(email);
}

export async function sendActivityEmailToCampaignAdminsAsync(campaignId: number): Promise<ISESEmailParams> {

  const to: Date = new Date();
  const from: Date = new Date(Date.now() - (24 * 60 * 60 * 1000));
  const activities = await getActivityByCampaignByTimeAsync(campaignId, from, to);

  if (activities.length === 0) {
    return;
  }

  const permissions: IUserPermission[] = await getPermissionsByCampaignIdAsync(campaignId);
  const permissionsFiltered = permissions.filter( (permission: IUserPermission ): boolean => {
    return permission.role === UserRole.CAMPAIGN_ADMIN;
  });

  const emails = permissionsFiltered.map((permission: IUserPermission ): string => {
    return permission.user.email;
  });

  if (emails.length === 0) {
    return;
  }

  const newContributionUpdates: string[] = activities.filter( (activity: IShortActivityResult) => {return activity.activityType === ActivityTypeEnum.CONTRIBUTION; }).map((activity: IShortActivityResult) => { return `- ID#${activity.activityId}: ${activity.notes}`; });
  const newExpenditureUpdates: string[] = activities.filter( (activity: IShortActivityResult) => { return activity.activityType === ActivityTypeEnum.EXPENDITURE; }).map((activity: IShortActivityResult) => { return `- ID#${activity.activityId}: ${activity.notes}`; });
  const newContributionComments: string[] = activities.filter( (activity: IShortActivityResult) => { return activity.activityType === ActivityTypeEnum.COMMENT_CONTR; }).map((activity: IShortActivityResult) => { return `- ID#${activity.activityId}: ${activity.notes}`; });
  const newExpenditureComments: string[]  = activities.filter( (activity: IShortActivityResult) => { return activity.activityType === ActivityTypeEnum.COMMENT_EXP; }).map((activity: IShortActivityResult) => { return `- ID#${activity.activityId}: ${activity.notes}`; });

  if (newContributionUpdates.length === 0 && newExpenditureUpdates.length === 0 && newContributionComments.length === 0 && newExpenditureComments.length === 0) {
    return;
  }

  const contributionsText: string = newContributionUpdates.length > 0 ? `Contributions:<br/><br/>The following contributions have been created or updated in the last 24 hours.<br/><br/>${newContributionUpdates.join('<br/>')}` : '';

  const contributionComments: string = newContributionComments.length > 0 ? `Contribution Comments:<br/><br/>The following contributions have been commented on in the last 24 hours.<br/><br/>${newContributionComments.join('<br/>')}` : '';

  const expendituresText: string = newExpenditureUpdates.length > 0 ? `Expenditures:<br/><br/>The following expenditures have been created or updated in the last 24 hours.<br/><br/>${newExpenditureUpdates.join('<br/>')}` : '';

  const expendituresComments: string = newExpenditureComments.length > 0 ? `Expenditures Comments:<br/><br/>The following expenditures have been commented on in the last 24 hours.<br/><br/>${newExpenditureComments.join('<br/>')}<br/><br/>` : '';

  const host = process.env.HOST_URL || 'http://localhost:3000';
  const email: ISESEmailParams = {
    Destination: {
      ToAddresses: emails,
      CcAddresses: ['susan.Mottet@portlandoregon.gov'],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<html><head><body><p>This is a daily transaction summary for your campaign's Contributions and Expenditures.</p><p>${contributionsText.replace('<br/>', '')}</p><p>${contributionComments.replace('<br/>', '')}</p><p>${expendituresText.replace('<br/>', '')}</p><p>${expendituresComments.replace('<br/>', '')}</p><p>In accordance with Portland City Code 2.16.170, if you believe a determination was made in error, you may file a Request for Reconsideration with the Director within seven days of this notification being sent. You may make this request by filling out a Request for Reconsideration form on the program website at www.portlandoregon.gov/OAE and submitting it to OpenElections@portlandoregon.gov.</p><p>If you would like more information about the transaction(s), please go to your campaign portal at <a href="${host}">${host}</a>.</p><p>Sincerely,<br/>Susan Mottet<br/>Director, Open and Accountable Elections<br/><a href="https://www.portlandoregon.gov/OAE">https://www.portlandoregon.gov/OAE</a><br/></p></body></head>`
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'This is a daily transaction summary for your campaign\'s Contributions and Expenditures.\r\n' +
              `${contributionsText.replace(new RegExp('<br/><br/>', 'g'), '\r\n\r\n').replace(new RegExp('<br/>', 'g'), '\r\n')}\r\n` +
              `${contributionComments.replace(new RegExp('<br/><br/>', 'g'), '\r\n\r\n').replace(new RegExp('<br/>', 'g'), '\r\n')}\r\n` +
              `${expendituresText.replace(new RegExp('<br/><br/>', 'g'), '\r\n\r\n').replace(new RegExp('<br/>', 'g'), '\r\n')}\r\n` +
              `${expendituresComments.replace(new RegExp('<br/><br/>', 'g'), '\r\n\r\n').replace(new RegExp('<br/>', 'g'), '\r\n')}\r\n` +
              'In accordance with Portland City Code 2.16.170, if you believe a determination was made in error, you may file a Request for Reconsideration with the Director within seven days of this notification being sent. You may make this request by filling out a Request for Reconsideration form on the program website at www.portlandoregon.gov/OAE and submitting it to OpenElections@portlandoregon.gov.\r\n' +
              `If you would like more information about the transaction(s), please go to your campaign portal at ${host}.\r\n` +
              'Sincerely,\r\n' +
              'Susan Mottet\r\n' +
              'Director, Open and Accountable Elections\r\n' +
              'https://www.portlandoregon.gov/OAE'
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Open and Accountable Elections Daily Campaign Transactions Summary`,
      }
    },
    Source: 'no-reply@openelectionsproject.org',
    ReplyToAddresses: ['susan.Mottet@portlandoregon.gov']
  };
  return sendEmail(email);
}

export async function sendEmail(params: ISESEmailParams): Promise<ISESEmailParams> {
  if (process.env.NODE_ENV === 'test') {
  } else if (process.env.NODE_ENV === 'development') {
    console.log('In develop mode, this email is not sent ', JSON.stringify(params));
  } else {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_DEFAULT_REGION || !process.env.HOST_URL) {
      throw new Error('The API needs AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY passed in as env variables');
    }
    const sendPromise = new AWS.SES({
      apiVersion: '2010-12-01',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_DEFAULT_REGION
    }).sendEmail(params).promise();
    await sendPromise.then(
        (data) => {
          console.log('sent email to ', params.Destination.ToAddresses, 'with aws ses message id of ', data.MessageId);
        }).catch(error => console.log(error));
  }
  return Promise.resolve(params);
}
