const AWS = require('aws-sdk');

export interface ISESEmailParams {
  Destination: {
    ToAddresses: string[]
  };
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
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
  ReplyToAddresses: string[];
}

export async function sendEmail(params: ISESEmailParams): Promise<ISESEmailParams> {
  if (process.env.NODE_ENV === 'test') {
  } else if (process.env.NODE_ENV === 'develop') {
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
