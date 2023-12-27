const awsServerlessExpress = require('aws-serverless-express');
const app = require('./server.js'); // Import your Express app

// Create a Serverless Express server from your Express app
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};