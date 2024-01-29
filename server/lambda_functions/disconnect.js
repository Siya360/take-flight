// server/disconnect.js
exports.handler = async (event) => {
    // Handle the disconnection event
    console.log("Client disconnected:", event.requestContext.connectionId);
    return {
        statusCode: 200,
    };
};
