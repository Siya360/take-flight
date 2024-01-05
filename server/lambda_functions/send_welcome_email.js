// Import AWS SDK
const AWS = require('aws-sdk');

// Create a new instance of AWS SES
const ses = new AWS.SES();

// Lambda function handler
exports.handler = async (event) => {
  // Extract email and name from the event object
  const { email, name } = event;

  // Define email parameters
  const params = {
    Destination: {
      // Set the recipient's email address
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Text: {
          // Set the email body
          Data: `Hello ${name}, welcome to our service!`,
          Charset: 'UTF-8'
        }
      },
      Subject: {
        // Set the email subject
        Data: 'Welcome Email',
        Charset: 'UTF-8'
      }
    },
    // Set the sender's email address
    Source: 'data@infoza.co.za' 
  };

  try {
    // Send the email and wait for the promise to resolve
    const data = await ses.sendEmail(params).promise();

    // Return a success message and the data returned by the sendEmail method
    return { message: 'Email sent', data };
  } catch (error) {
    // Log the error and throw it
    console.error(error);
    throw error;
  }
};