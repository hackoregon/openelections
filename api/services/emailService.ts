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
                    Data: newUserEmailHtml(params)
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
                    Data: resendInvitiationEmailHtml(params)
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
                    Data: passwordResetEmailHtml(params)
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
                    Data: existingUserInviteEmailHtml(params)
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
        Source: 'no-reply@openelectionsportland.org',
    };
    return sendEmail(email);
}

export async function sendActivityEmailToCampaignAdminsAsync(campaignId: number): Promise<ISESEmailParams> {

    const to: Date = new Date();
    let from: Date = new Date(Date.now() - (24 * 60 * 60 * 1000));
    if (process.env.APP_ENV !== 'production') {
        // last five minutes
        from = new Date(Date.now() - (5 * 60 * 1000));
    }
    const activities = await getActivityByCampaignByTimeAsync(campaignId, from, to);

    if (activities.length === 0) {
        return;
    }

    const permissions: IUserPermission[] = await getPermissionsByCampaignIdAsync(campaignId);
    const permissionsFiltered = permissions.filter((permission: IUserPermission): boolean => {
        return permission.role === UserRole.CAMPAIGN_ADMIN;
    });

    const emails = permissionsFiltered.map((permission: IUserPermission): string => {
        return permission.user.email;
    });

    if (emails.length === 0) {
        return;
    }

    const newContributionUpdates: string[] = activities.filter((activity: IShortActivityResult) => {
        return activity.activityType === ActivityTypeEnum.CONTRIBUTION;
    }).map((activity: IShortActivityResult) => {
        return `- ID#${activity.activityId}: ${activity.notes}`;
    });
    const newExpenditureUpdates: string[] = activities.filter((activity: IShortActivityResult) => {
        return activity.activityType === ActivityTypeEnum.EXPENDITURE;
    }).map((activity: IShortActivityResult) => {
        return `- ID#${activity.activityId}: ${activity.notes}`;
    });
    const newContributionComments: string[] = activities.filter((activity: IShortActivityResult) => {
        return activity.activityType === ActivityTypeEnum.COMMENT_CONTR;
    }).map((activity: IShortActivityResult) => {
        return `- ID#${activity.activityId}: ${activity.notes}`;
    });
    const newExpenditureComments: string[] = activities.filter((activity: IShortActivityResult) => {
        return activity.activityType === ActivityTypeEnum.COMMENT_EXP;
    }).map((activity: IShortActivityResult) => {
        return `- ID#${activity.activityId}: ${activity.notes}`;
    });

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
                    Data: summaryEmailHtml(newContributionUpdates, newExpenditureUpdates, newContributionComments, newExpenditureComments)
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
        Source: 'no-reply@openelectionsportland.org',
        ReplyToAddresses: ['susan.Mottet@portlandoregon.gov']
    };
    return sendEmail(email);
}

export async function sendEmail(params: ISESEmailParams): Promise<ISESEmailParams> {
    if (process.env.APP_ENV !== 'production') {
        params.Message.Subject.Data = 'QA: ' + params.Message.Subject.Data;
    }
    if (process.env.NODE_ENV === 'test') {
    } else if (process.env.NODE_ENV === 'development') {
        console.log('In develop mode, this email is not sent ', JSON.stringify(params));
    } else {
        if (params.Destination.ToAddresses.filter(item => item.includes('openelectionsportland.org')).length >= 1) {
            console.log('Dont send emails to any address for openelectionsportland.org');
            return params;
        }
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

export function newUserEmailHtml(params: ISendNewUserInvitationEmailAttrs) {
    const host = process.env.HOST_URL || 'http://localhost:3000';
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>New User Invitation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="https://open-elections.s3.us-west-2.amazonaws.com/images/favicon.ico" />
    <link
      href="//fonts.googleapis.com/css?family=Poppins:400,500,600"
      rel="stylesheet"
    />
  </head>
  <body style="background-color: #313131; padding: 40px;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td
          valign="top"
          align="left"
          bgcolor="black"
          style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Poppins, sans-serif;"
        >
          <table>
            <!-- HEADER -->
            <table>
              <tr>
                <td
                  align="left"
                  style="padding-left: 40px; padding-right: 10px;"
                  bgcolor="black"
                >
                  <img src="https://open-elections.s3.us-west-2.amazonaws.com/images/favicon.ico" style="display: block;" />
                </td>
                <td
                  valign="top"
                  align="right"
                  style="color: #ffffff; padding-left: 0px; padding-top: 40px; padding-bottom: 40px; font-family: Poppins, sans-serif; font-size: 24px;"
                >
                  <b>Open Elections</b>
                </td>
              </tr>
            </table>

            <!-- BODY -->
            <tr>
              <td bgcolor="#ffffff">
                <table border="0" cellpadding="40" cellspacing="0" width="100%">
                  <tr>
                    <td
                      style="color: #153643; font-family: Poppins, sans-serif; font-size: 20px;"
                    >
                      You've been invited to join the following portal on Open
                      Elections by Civic:
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="text-align: center; padding: 20px 0 30px 0; color: #153643; font-family: Poppins, sans-serif; font-size: 24px; line-height: 20px;"
                    >
                      <b>${params.campaignName || params.governmentName || 'Open Elections Program'}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="font-family: Poppins, sans-serif; font-size: 20px;"
                    >
                      To complete your invitation, click the Sign up button in
                      this email and follow the instructions provided.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 30px 0px 30px;">
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                      >
                        <tr>
                          <td
                            align="center"
                            style="color: #303F9F; font-family: Poppins, sans-serif; font-size: 14px;"
                            width="25px"
                          >
                            <a
                              style="
                                text-decoration:none;
                                background-color: #303F9F;
                                border: none;
                                color: white;
                                padding: 15px 25%;
                                text-align: center;
                                font-size: 16px;
                                cursor: pointer;
                                border-radius: 6px;"
                              href="${host}/invitation?email=${params.to}${params.campaignName ? '&campaign=' + params.campaignName : ''}${params.governmentName ? '&government=' + params.governmentName : ''}&invitationCode=${params.invitationCode}"
                            >
                              Sign Up
                            </a>
                          </td>
                        </tr>
                      </table>

                      <tr>
                        <td
                          style="text-align: center; font-family: Poppins, sans-serif; font-size: 10px; padding-bottom: 40px; margin-top: 5px;"
                        >
                          If this email was sent to you by mistake, please
                          disregard it.
                        </td>
                      </tr>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export function existingUserInviteEmailHtml(params: ISendInvitationEmailAttrs) {
    const host = process.env.HOST_URL || 'http://localhost:3000';
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>New User Invitation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="https://open-elections.s3.us-west-2.amazonaws.com/images/favicon.ico" />
    <link
      href="//fonts.googleapis.com/css?family=Poppins:400,500,600"
      rel="stylesheet"
    />
  </head>
  <body style="background-color: #313131; padding: 40px;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td
          valign="top"
          align="left"
          bgcolor="black"
          style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Poppins, sans-serif;"
        >
          <table>
            <!-- HEADER -->
            <table>
              <tr>
                <td
                  align="left"
                  style="padding-left: 40px; padding-right: 10px;"
                  bgcolor="black"
                >
                  <img src="https://open-elections.s3.us-west-2.amazonaws.com/images/favicon.ico" style="display: block;" />
                </td>
                <td
                  valign="top"
                  align="right"
                  style="color: #ffffff; padding-left: 0px; padding-top: 40px; padding-bottom: 40px; font-family: Poppins, sans-serif; font-size: 24px;"
                >
                  <b>Open Elections</b>
                </td>
              </tr>
            </table>

            <!-- BODY -->
            <tr>
              <td bgcolor="#ffffff">
                <table border="0" cellpadding="40" cellspacing="0" width="100%">
                  <tr>
                    <td
                      style="color: #153643; font-family: Poppins, sans-serif; font-size: 20px;"
                    >
                      You've been invited to join the following portal on Open
                      Elections by Civic:
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="text-align: center; padding: 20px 0 30px 0; color: #153643; font-family: Poppins, sans-serif; font-size: 24px; line-height: 20px;"
                    >
                      <b>${params.campaignName || params.governmentName || 'Open Elections Program'}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="font-family: Poppins, sans-serif; font-size: 20px;"
                    >
                      To complete your invitation, click the Sign up button in
                      this email and follow the instructions provided.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 30px 0px 30px;">
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                      >
                        <tr>
                          <td
                            align="center"
                            style="color: #303F9F; font-family: Poppins, sans-serif; font-size: 14px;"
                            width="25px"
                          >
                            <a
                              style="
                                text-decoration:none;
                                background-color: #303F9F;
                                border: none;
                                color: white;
                                padding: 15px 25%;
                                text-align: center;
                                font-size: 16px;
                                cursor: pointer;
                                border-radius: 6px;"
                              href="${host}/sign-in"
                            >
                              Sign Up
                            </a>
                          </td>
                        </tr>
                      </table>

                      <tr>
                        <td
                          style="text-align: center; font-family: Poppins, sans-serif; font-size: 10px; padding-bottom: 40px; margin-top: 5px;"
                        >
                          If this email was sent to you by mistake, please
                          disregard it.
                        </td>
                      </tr>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export function resendInvitiationEmailHtml(params: IResendInvitationEmailAttrs) {
    const host = process.env.HOST_URL || 'http://localhost:3000';
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>New User Invitation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="https://open-elections.s3.us-west-2.amazonaws.com/images/favicon.ico" />
    <link
      href="//fonts.googleapis.com/css?family=Poppins:400,500,600"
      rel="stylesheet"
    />
  </head>
  <body style="background-color: #313131; padding: 40px;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td
          valign="top"
          align="left"
          bgcolor="black"
          style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Poppins, sans-serif;"
        >
          <table>
            <!-- HEADER -->
            <table>
              <tr>
                <td
                  align="left"
                  style="padding-left: 40px; padding-right: 10px;"
                  bgcolor="black"
                >
                  <img src="https://open-elections.s3.us-west-2.amazonaws.com/images/favicon.ico" style="display: block;" />
                </td>
                <td
                  valign="top"
                  align="right"
                  style="color: #ffffff; padding-left: 0px; padding-top: 40px; padding-bottom: 40px; font-family: Poppins, sans-serif; font-size: 24px;"
                >
                  <b>Open Elections</b>
                </td>
              </tr>
            </table>

            <!-- BODY -->
            <tr>
              <td bgcolor="#ffffff">
                <table border="0" cellpadding="40" cellspacing="0" width="100%">
                  <tr>
                    <td
                      style="color: #153643; font-family: Poppins, sans-serif; font-size: 20px;"
                    >
                      You've been invited to join the following portal on Open
                      Elections by Civic:
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="text-align: center; padding: 20px 0 30px 0; color: #153643; font-family: Poppins, sans-serif; font-size: 24px; line-height: 20px;"
                    >
                      <b>Open Elections Program</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="font-family: Poppins, sans-serif; font-size: 20px;"
                    >
                      To complete your invitation, click the Sign up button in
                      this email and follow the instructions provided.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 30px 0px 30px;">
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                      >
                        <tr>
                          <td
                            align="center"
                            style="color: #303F9F; font-family: Poppins, sans-serif; font-size: 14px;"
                            width="25px"
                          >
                            <a
                              style="
                                text-decoration:none;
                                background-color: #303F9F;
                                border: none;
                                color: white;
                                padding: 15px 25%;
                                text-align: center;
                                font-size: 16px;
                                cursor: pointer;
                                border-radius: 6px;"
                              href="${host}/invitation?email=${params.to}&invitationCode=${params.invitationCode}"
                            >
                              Sign Up
                            </a>
                          </td>
                        </tr>
                      </table>

                      <tr>
                        <td
                          style="text-align: center; font-family: Poppins, sans-serif; font-size: 10px; padding-bottom: 40px; margin-top: 5px;"
                        >
                          If this email was sent to you by mistake, please
                          disregard it.
                        </td>
                      </tr>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export function passwordResetEmailHtml(params: ISendPasswordResetEmailAttrs) {
    const host = process.env.HOST_URL || 'http://localhost:3000';
    return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>User Password Reset</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="https://open-elections.s3.us-west-2.amazonaws.com/images/favicon.ico" />
    <link
      href="//fonts.googleapis.com/css?family=Poppins:400,500,600"
      rel="stylesheet"
    />
  </head>
  <body style="background-color: #313131; padding: 40px;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td
          valign="top"
          align="left"
          bgcolor="black"
          style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Poppins, sans-serif;"
        >
          <table>
            <!-- HEADER -->
            <table>
              <tr>
                <td
                  align="left"
                  style="padding-left: 40px; padding-right: 10px;"
                  bgcolor="black"
                >
                  <img src="https://open-elections.s3.us-west-2.amazonaws.com/images/favicon.ico" style="display: block;" />
                </td>
                <td
                  valign="top"
                  align="right"
                  style="color: #ffffff; padding-left: 0px; padding-top: 40px; padding-bottom: 40px; font-family: Poppins, sans-serif; font-size: 24px;"
                >
                  <b>Open Elections</b>
                </td>
              </tr>
            </table>

            <!-- BODY -->
            <tr>
              <td bgcolor="#ffffff">
                <table border="0" cellpadding="40" cellspacing="0" width="100%">
                  <tr>
                    <td
                      align="center"
                      style="color: #153643; font-family: Poppins, sans-serif; font-size: 20px;"
                    >
                      A password reset has been requested
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 30px 0px 30px;">
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                      >
                        <tr>
                          <td
                            align="center"
                            style="color: #303F9F; font-family: Poppins, sans-serif; font-size: 14px;"
                            width="25px"
                          >
                            <a
                              style="
                                text-decoration:none;
                                background-color: #303F9F;
                                border: none;
                                color: white;
                                padding: 15px 25%;
                                text-align: center;
                                font-size: 16px;
                                cursor: pointer;
                                border-radius: 6px;"
                              href="${host}/update-forgotten-password?invitationCode=${params.invitationCode}"
                              >Click here to reset your password.</a
                            >
                          </td>
                        </tr>
                      </table>

                      <tr>
                        <td
                          style="text-align: center; font-family: Poppins, sans-serif; font-size: 10px; padding-bottom: 40px; margin-top: 5px;"
                        >
                          If this email was sent to you by mistake, please
                          disregard it.
                        </td>
                      </tr>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export function summaryEmailHtml(newContributionUpdates, newExpenditureUpdates, newContributionComments, newExpenditureComments) {
    const host = process.env.HOST_URL || 'http://localhost:3000';
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>24 Hr Summary Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="https://open-elections.s3.us-west-2.amazonaws.com/images/favicon.ico" />
    <link
      href="//fonts.googleapis.com/css?family=Poppins:400,500,600"
      rel="stylesheet"
    />
  </head>
  <body style="background-color: #313131; padding: 40px;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td
          valign="top"
          align="left"
          bgcolor="black"
          style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Poppins, sans-serif;"
        >
          <table>
            <!-- HEADER -->
            <table>
              <tr>
                <td
                  align="left"
                  style="padding-left: 40px; padding-right: 10px;"
                  bgcolor="black"
                >
                  <img src="https://open-elections.s3.us-west-2.amazonaws.com/images/favicon.ico" style="display: block;" />
                </td>
                <td
                  valign="top"
                  align="right"
                  style="color: #ffffff; padding-left: 0px; padding-top: 40px; padding-bottom: 40px; font-family: Poppins, sans-serif; font-size: 24px;"
                >
                  <b>Open Elections</b>
                </td>
              </tr>
            </table>

            <!-- BODY -->
            <tr>
              <td bgcolor="#ffffff">
                <table border="0" cellpadding="40" cellspacing="0" width="100%">
                  <tr>
                    <td
                      style="color: #153643; font-family: Poppins, sans-serif; font-size: 20px;"
                    >
                      This is a daily transaction summary for your campaign's Contributions and Expenditures.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="font-size: 20px; padding: 10px 0px 20px 80px; text-align: left; margin-left:30px; color: #153643; font-family: Poppins, sans-serif;"
                    >
                      <b>Contributions</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="font-size: 20px; font-family: Poppins, sans-serif; padding: 0px 0px 20px 80px;"
                    >
                      The following contributions have been created or updated in the last 24 hours:
                    </td>
                  </tr>
                  ${newContributionUpdates.filter(item => !!item && item.trim() !== '').map((item: string): string => {
        return `<tr><td style="font-size: 20px; font-family: Poppins, sans-serif; padding: 0px 0px 5px 100px;">${item}</td></tr>`;
    })}
                  <tr>
                    <td
                      style="font-size: 20px; padding: 10px 0px 20px 80px; text-align: left; margin-left:30px; color: #153643; font-family: Poppins, sans-serif;"
                    >
                      <b>Contribution Comments</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="font-size: 20px; font-family: Poppins, sans-serif; font-family: Poppins, sans-serif; padding: 0px 0px 20px 80px;"
                    >
                      The following contributions have been commented on in the last 24 hours:
                    </td>
                  </tr>
                  ${newContributionComments.filter(item => !!item && item.trim() !== '').map((item: string): string => {
        return `<tr><td style="font-size: 20px; font-family: Poppins, sans-serif; padding: 0px 0px 5px 100px;">${item}</td></tr>`;
    })}
                  <tr>
                    <td
                      style="font-size: 20px; padding: 10px 0px 20px 80px; text-align: left; margin-left:30px; color: #153643; font-family: Poppins, sans-serif;"
                    >
                      <b>Expenditures</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="font-size: 20px; font-family: Poppins, sans-serif; padding: 0px 0px 20px 80px;"
                    >
                      The following expenditures have been commented on in the last 24 hours
                    </td>
                  </tr>
                  ${newExpenditureUpdates.filter(item => !!item && item.trim() !== '').map((item: string): string => {
        return `<tr><td style="font-size: 20px; font-family: Poppins, sans-serif; padding: 0px 0px 5px 100px;">${item}</td></tr>`;
    })}
                  <tr>
                    <td
                      style="font-size: 20px; padding: 10px 0px 20px 80px; text-align: left; margin-left:30px; color: #153643; font-family: Poppins, sans-serif;"
                    >
                      <b>Expenditure Comments</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="font-size: 20px; font-family: Poppins, sans-serif; padding: 0px 0px 20px 80px;"
                    >
                      The following expenditures have been commented on in the last 24 hours:
                    </td>
                  </tr>
                  ${newExpenditureComments.filter(item => !!item && item.trim() !== '').map((item: string): string => {
        return `<tr><td style="font-size: 20px; font-family: Poppins, sans-serif; padding: 0px 0px 5px 100px;">${item}</td></tr>`;
    })}
                  <tr>
                    <td
                      style="font-size: 20px; font-family: Poppins, sans-serif; padding-left: 40px;
                      padding-top: 0px;
                      padding-bottom: 20px;
                      line-height: 1.5;"
                    >
                      In accordance with Portland City Code 2.16.170, if you believe a determination was made in error, you may file a Request for Reconsideration with the Director within seven days of this notification being sent. You may make this request by filling out a Request for Reconsideration form on the program website at https://www.portlandoregon.gov/OAE and submitting it to OpenElections@portlandoregon.gov.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="font-size: 20px; font-family: Poppins, sans-serif; padding-left: 40px;
                      padding-top: 0px;
                      padding-bottom: 20px; line-height: 1.5;"
                    >
                      If you would like more information about the transaction(s), please go to your campaign portal <a href="${host}/dashboard">campaign portal</a>.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="font-size: 20px; font-family: Poppins, sans-serif; padding-left: 40px;
                      padding-top: 0px;
                      padding-bottom: 0px; line-height: 1.5;"
                    >
                      Sincerely,
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="font-size: 20px; font-family: Poppins, sans-serif; padding-left: 40px;
                      padding-top: 0px;
                      padding-bottom: 0px; line-height: 1.5;"
                    >
                      Susan Mottet
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="font-size: 20px; font-family: Poppins, sans-serif; padding-left: 40px;
                      padding-top: 0px;
                      padding-bottom: 0px; line-height: 1.5;"
                    >
                      Director, Open and Accountable Elections
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="font-size: 20px; font-family: Poppins, sans-serif; padding-left: 40px;
                      padding-top: 0px;
                      padding-bottom: 40px; line-height: 1.5;"
                    >
                      <a href="https://www.portlandoregon.gov/OAE">
                        https://www.portlandoregon.gov/OAE</a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`; }

