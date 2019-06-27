import { UserRole } from '../models/entity/Permission';

const AWS = require('aws-sdk');

export interface ISESEmailParams {
  Destination: {
    ToAddresses: string[]
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
          Data: `<html><head><body><p>You've been invited to join the ${params.campaignName || params.governmentName}</p><p><a href="${host}/invitation?invitationCode=${params.invitationCode}">Click here to accept invitation.</a></p></body></head>`
        },
        Text: {
          Charset: 'UTF-8',
          Data: `You've been invited to join the ${params.campaignName || params.governmentName}. Please visit ${host}/invitation?invitationCode=${params.invitationCode} to accept the invitation`
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `You've been invited to ${params.campaignName || params.governmentName}`,
      }
    },
    Source: 'no-reply@openelectionsprojecg.org',
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
    Source: 'no-reply@openelectionsprojecg.org',
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
          Data: `<html><head><body><p>A password reset has been requested</p><p><a href="${host}/passwordReset?invitationCode=${params.invitationCode}">Click here to reset your password.</a></p></body></head>`
        },
        Text: {
          Charset: 'UTF-8',
          Data: `A password reset has been requested. Please visit ${host}/passwordReset?invitationCode=${params.invitationCode} to reset your password`
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Reset your password`,
      }
    },
    Source: 'no-reply@openelectionsprojecg.org',
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
    Source: 'no-reply@openelectionsprojecg.org',
  };
  return sendEmail(email);
}

export async function sendEmail(params: ISESEmailParams): Promise<ISESEmailParams> {
  if (process.env.NODE_ENV === 'test') {
  } else if (process.env.NODE_ENV === 'development') {
    console.log('In develop mode, this email is not sent ', params);
  } else {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('The API needs AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY passed in as env variables');
    }
    const sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    await sendPromise.then(
        (data) => {
          console.log('sent email to ', params.Destination.ToAddresses, 'with aws ses message id of ', data.MessageId);
        });
  }
  return Promise.resolve(params);
}
