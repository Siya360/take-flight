// Lambda function to run the express app

const serverlessExpress = require('@vendia/serverless-express');
const app = require('./server'); // Import the Express app

exports.handler = serverlessExpress({ app });

