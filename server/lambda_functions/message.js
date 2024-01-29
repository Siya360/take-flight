const AWS = require('aws-sdk');

exports.handler = async (lambdaEvent) => {
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: lambdaEvent.requestContext.domainName + '/' + lambdaEvent.requestContext.stage
    });

    const connectionId = lambdaEvent.requestContext.connectionId;
    const postData = JSON.parse(lambdaEvent.body).data;

    // Handle the incoming message
    console.log("Message received from:", connectionId);
    console.log("Message content:", postData);

    // Example: Echo the received message back to the client
    await apigwManagementApi.postToConnection({
        ConnectionId: connectionId,
        Data: `Echo: ${postData}`
    }).promise();

    return {
        statusCode: 200,
    };
};

