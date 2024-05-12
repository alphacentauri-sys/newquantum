const rollHistory = document.getElementById('roll-history');
const diceContainer = document.querySelector('.dice-container');

const ws = new WebSocket('ws:https://newquantumm.netlify.app/:3000'); // Connect to WebSocket server

let clientId; // Variable to store the client ID

ws.onopen = () => {
  console.log('Connected to server');
  clientId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // Generate random ID
  ws.send(JSON.stringify({ clientId })); // Send the ID to the server
};

ws.onmessage = (event) => {
  // Parse received JSON data (assuming server sends JSON-encoded data)
  const newRollData = JSON.parse(event.data);

  // Update rollHistory content with the new roll information
  rollHistory.innerHTML = newRollData; // Overwrite the entire content (keeps only the last 10 rolls)
};

diceContainer.addEventListener('click', handleDiceRoll);

function handleDiceRoll(event) {
  const button = event.target;
  if (!button.matches('button')) return;

  const diceSides = parseInt(button.dataset.dice, 10);
  const rollResult = Math.floor(Math.random() * diceSides) + 1;

  const rollData = {
    clientId, // Use the generated clientId
    diceSides,
    result: rollResult,
  };

  ws.send(JSON.stringify(rollData));
}
