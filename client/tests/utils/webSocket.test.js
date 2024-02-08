// webSocket.test.js
import { connectWebSocket, sendMessage, closeWebSocket } from '../../src/utils/websocket';

// Mock the global WebSocket
global.WebSocket = jest.fn();

// Mock instance methods for the WebSocket instance
const mockSend = jest.fn();
const mockClose = jest.fn();

WebSocket.prototype.send = mockSend;
WebSocket.prototype.close = mockClose;

describe('websocket utility functions', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    WebSocket.mockClear();
    mockSend.mockClear();
    mockClose.mockClear();
  });

  it('connects to WebSocket', () => {
    const updateFlightCallback = jest.fn();
    connectWebSocket(updateFlightCallback);

    // Verify WebSocket was instantiated
    expect(WebSocket).toHaveBeenCalled();
    expect(WebSocket).toHaveBeenCalledWith('wss://nfu0laf7yc.execute-api.us-east-1.amazonaws.com/dev');
  });

  it('sends a message when WebSocket is open', () => {
    // Set readyState to OPEN
    WebSocket.prototype.readyState = WebSocket.OPEN;
    const message = { type: 'test' };
    sendMessage(message);

    // Verify send was called with the correct message
    expect(mockSend).toHaveBeenCalledWith(JSON.stringify(message));
  });

  it('does not send a message when WebSocket is not open', () => {
    // Set readyState to CONNECTING
    WebSocket.prototype.readyState = WebSocket.CONNECTING;
    const message = { type: 'test' };
    sendMessage(message);

    // Verify send was not called
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('closes the WebSocket connection', () => {
    connectWebSocket(jest.fn()); // Establish the connection first
    closeWebSocket();

    // Verify close was called
    expect(mockClose).toHaveBeenCalled();
  });
});
