let ws = null;

const connectWebSocket = (updateFlightCallback) => {
    ws = new WebSocket('wss://nfu0laf7yc.execute-api.us-east-1.amazonaws.com/dev');

    ws.onopen = function (event) {
      console.log("Connection established");
    };

    ws.onmessage = function (event) {
      console.log("Message received:", event.data);
      const message = JSON.parse(event.data);
      if (message.updatedFlight) {
        updateFlightCallback(message.updatedFlight);
      }
    };

    ws.onclose = function (event) {
      console.log("Connection closed");
    };
};

const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.error("WebSocket is not connected.");
    }
};

const closeWebSocket = () => {
    if (ws) {
        ws.close();
    }
};

// Function to handle incoming data
const handleMessage = (data) => {
  // Handle incoming data
  // This could involve parsing the data, updating the state, etc.
};

// Export the functions so they can be used elsewhere
export { connectWebSocket, sendMessage, closeWebSocket, handleMessage };
