// server/connect.js
exports.handler = async (event) => {
    // Handle the connection event
    console.log("Client connected:", event.requestContext.connectionId);
    return {
        statusCode: 200,
    };
};
