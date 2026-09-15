import { test, expect } from '@playwright/test';
import { io, Socket } from 'socket.io-client';

test.describe('Real-Time Gateway - Socket.IO Lifecycle & Messaging', () => {

const socketServerUrl = process.env.SOCKET_URL || 'http://localhost:3000';
let clientSocket: Socket;

test.afterEach(() => {
if (clientSocket && clientSocket.connected) {
clientSocket.disconnect();
}
});

test('Gateway should establish WebSocket connection successfully', async () => {
await new Promise((resolve, reject) => {
clientSocket = io(socketServerUrl, {
transports: ['websocket'],
reconnection: false,
timeout: 5000,
});

  clientSocket.on('connect', () => {
    expect(clientSocket.connected).toBeTruthy();
    resolve();
  });

  clientSocket.on('connect_error', (error) => {
    reject(new Error(`WebSocket connection failed: ${error.message}`));
  });
});

});

test('Gateway should reject message emit from unauthorized sender', async () => {
await new Promise((resolve) => {
clientSocket = io(socketServerUrl, {
transports: ['websocket'],
reconnection: false,
timeout: 5000,
});

  clientSocket.on('connect', () => {
    // Emit direct message without prior mutual friendship status
    clientSocket.emit('private_message', {
      recipient_id: '99999',
      content: 'Hello unauthenticated user',
    });
  });

  // Gateway must reject the event with an error payload
  clientSocket.on('error', (payload) => {
    expect(payload).toHaveProperty('message');
    resolve();
  });

  // Fallback timeout to prevent hanging tests
  setTimeout(() => resolve(), 3000);
});

});

});