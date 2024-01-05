const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const { validateToken } = require('./authMiddleware');
const { CognitoIdentityProviderClient, SignUpCommand } = require("@aws-sdk/client-cognito-identity-provider");
const fs = require('fs');
const wtf = require('wtfnode');

// Configure AWS SDK
const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  
  // Write the error and stack trace to a log file asynchronously
  fs.appendFile('error.log', `Uncaught Exception: ${error}\nStack Trace: ${error.stack}\n`, err => {
    if (err) console.error('Error writing to log file:', err);
  });

  // Dump open handles
  wtf.dump();

  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);

  // Serialize 'promise' and 'reason' to a string for better logging
  const promiseString = JSON.stringify(promise, null, 2);
  const reasonString = reason instanceof Error ? reason.stack : JSON.stringify(reason, null, 2);

  // Write to log file
  fs.appendFile('error.log', `Unhandled Rejection at: ${promiseString}, reason: ${reasonString}\n`, err => {
    if (err) console.error('Error writing to log file:', err);
  });

  wtf.dump();
});

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  const params = {
    ClientId: '4dvvaqvf51gvp35rpvpebe6jbg', // Replace with your user pool client ID
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email
      },
      // Add other attributes here if needed
    ]
  };

  try {
    const data = await client.send(new SignUpCommand(params));
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

// Protected route example
app.get('/protected-route', validateToken, (req, res) => {
  res.send(`Welcome, user ${req.user.username}!`);
});

// User Authentication (Login)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: '4dvvaqvf51gvp35rpvpebe6jbg', // Replace with your user pool client ID
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  };

  cognitoIdentityServiceProvider.initiateAuth(params, function(err, data) {
    if (err) {
      console.error(err);
      res.status(400).send(err);
    } else {
      // Send the ID, access, and refresh tokens
      res.send({
        idToken: data.AuthenticationResult.IdToken,
        accessToken: data.AuthenticationResult.AccessToken,
        refreshToken: data.AuthenticationResult.RefreshToken
      });
    }
  });
});

// User Profile Management
app.put('/profile', validateToken, (req, res) => {
  const { userAttributes } = req.body;

  const params = {
    AccessToken: req.user.token, // Access token from the validated token
    UserAttributes: userAttributes // User attributes to update
  };

  cognitoIdentityServiceProvider.updateUserAttributes(params, function(err, data) {
    if (err) {
      console.error(err);
      res.status(400).send(err);
    } else {
      // Send a success message
      res.send({ message: 'User profile updated successfully' });
    }
  });
});

// Password Management
// Change a user's password
app.post('/user/change-password', validateToken, (req, res) => {
  const { previousPassword, proposedPassword } = req.body;
  const accessToken = req.headers.authorization.split(' ')[1]; // Assuming Bearer token

  const params = {
    PreviousPassword: previousPassword,
    ProposedPassword: proposedPassword,
    AccessToken: accessToken
  };

  cognitoIdentityServiceProvider.changePassword(params, function(err, data) {
    if (err) {
      console.error(err);
      res.status(400).send({ message: 'Error changing password.' });
    } else {
      res.send({ message: 'Password changed successfully' });
    }
  });
});

// Initiate a forgot password flow
app.post('/user/forgot-password', (req, res) => {
  const { username } = req.body;
  const clientId = process.env.COGNITO_CLIENT_ID; // Replace with environment variable

  const params = {
    Username: username,
    ClientId: clientId
  };

  cognitoIdentityServiceProvider.forgotPassword(params, function(err, data) {
    if (err) {
      console.error(err);
      res.status(400).send({ message: 'Error initiating password reset.' });
    } else {
      res.send({ message: 'Password reset code sent' });
    }
  });
});

// Confirm new password after a forgot password request
app.post('/user/confirm-forgot-password', (req, res) => {
  const { username, confirmationCode, newPassword } = req.body;
  const clientId = process.env.COGNITO_CLIENT_ID; // Replace with environment variable

  const params = {
    Username: username,
    ConfirmationCode: confirmationCode,
    Password: newPassword,
    ClientId: clientId
  };

  cognitoIdentityServiceProvider.confirmForgotPassword(params, function(err, data) {
    if (err) {
      console.error(err);
      res.status(400).send({ message: 'Error resetting password.' });
    } else {
      res.send({ message: 'Password reset successfully' });
    }
  });
});

// Verify user attributes like email or phone number
app.post('/user/verify', validateToken, (req, res) => {
  const { attributeName, code } = req.body;
  const accessToken = req.headers.authorization.split(' ')[1]; // Assuming Bearer token

  const params = {
    AccessToken: accessToken,
    AttributeName: attributeName, // Attribute to verify (e.g., 'email' or 'phone_number')
    Code: code // Verification code
  };

  cognitoIdentityServiceProvider.verifyUserAttribute(params, function(err, data) {
    if (err) {
      console.error(err);
      res.status(400).send({ message: 'Error verifying attribute.' });
    } else {
      res.send({ message: 'Attribute verified successfully' });
    }
  });
});

// Resend verification
app.post('/user/resend-verification', validateToken, (req, res) => {
  const { attributeName } = req.body;
  const accessToken = req.headers.authorization.split(' ')[1]; // Assuming Bearer token

  const params = {
    AccessToken: accessToken,
    AttributeName: attributeName, // Attribute to verify (e.g., 'email' or 'phone_number')
    Code: code // Verification code
  };

  cognitoIdentityServiceProvider.getUserAttributeVerificationCode(params, function(err, data) {
    if (err) {
      console.error(err);
      res.status(400).send({ message: 'Error resending verification code.' });
    } else {
      res.send({ message: 'Verification code sent' });
    }
  });
});

// Refresh the user's tokens
app.post('/token/refresh', (req, res) => {
  const { refreshToken } = req.body;

  const params = {
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    ClientId: '4dvvaqvf51gvp35rpvpebe6jbg', // Replace with your user pool client ID
    AuthParameters: {
      'REFRESH_TOKEN': refreshToken
    }
  };

  cognitoIdentityServiceProvider.initiateAuth(params, function(err, data) {
    if (err) {
      console.error(err);
      res.status(400).send({ message: 'Error refreshing token.' });
    } else {
      // Ensure the response includes new access and ID tokens
      const { AccessToken, IdToken } = data.AuthenticationResult;
      res.send({
        accessToken: AccessToken,
        idToken: IdToken
      });
    }
  });
});

// Log out a user
app.post('/logout', validateToken, (req, res) => {
  // Extract the access token from the user object added by the validateToken middleware
  const { accessToken } = req.user;

  const params = {
    AccessToken: accessToken // Access token from the validated token
  };

  cognitoIdentityServiceProvider.globalSignOut(params, function(err, data) {
    if (err) {
      console.error(err);
      res.status(400).send({ message: 'Error logging out.', error: err.message });
    } else {
      res.send({ message: 'Logged out successfully' });
    }
  });
});

// API Health Check
app.get('/health', (req, res) => {
  // Implement health check logic
  res.send({ status: 'OK', timestamp: new Date() });
});

// Display non-sensitive configuration details or environment settings
app.get('/debug/config', validateToken, (req, res) => {
  const config = {
    nodeEnvironment: process.env.NODE_ENV,
    port: process.env.PORT,
    // Add more non-sensitive configuration details as needed
  };

  res.send(config);
});

// Show system status, memory usage, or other diagnostics data
app.get('/debug/status', validateToken, (req, res) => {
  const status = {
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    // Add more diagnostics data as needed
  };

  res.send(status);
});

// Export the app for serverless use
module.exports = app;
