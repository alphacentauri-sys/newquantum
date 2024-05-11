const express = require('express');
const path = require('path'); // Added for path resolution
const ws = require('ws'); // Import the ws library

const app = express();
const server = app.listen(3000, () => console.log('Server listening on port 3000'));

// Serve static files from the 'public' directory
app.use(express.static(__dirname));

const WebSocket = require('ws'); // Import WebSocket from the ws library
const wss = new WebSocket.Server({ server }); // Use ws.Server
let rollHistory = []; // Array to store roll history (initially empty)

wss.on('connection', (ws) => {
  let clientId; // Variable to store the client ID

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    clientId = data.clientId; // Extract the client ID

    const rollData = {
      ...data, // Spread operator to include all data from the message
      // clientId is already assigned from data.clientId
    };

    const timestamp = new Date().toLocaleTimeString();
    const newRoll = `<div class="roll-history-item">[${timestamp}] <span class="math-inline"> Client ${clientId.substring(0, 4)} rolled d${rollData.diceSides}: ${rollData.result}\n</div>`; // Truncate clientId to 4 chars

    console.log(rollData);
    console.log(newRoll);

    rollHistory.push(newRoll);

    // Broadcast the new roll and keep only the last 10 entries
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(rollHistory.slice(-10))); // Send only the last 10 rolls
      }
    });
  });

  // Send initial empty roll history to new client
  ws.send(JSON.stringify([]));
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
