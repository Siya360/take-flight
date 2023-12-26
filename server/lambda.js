// lambda.js
const serverless = require('serverless-express');
const app = require('./app'); // Import your Express app

exports.handler = serverless({ app });
