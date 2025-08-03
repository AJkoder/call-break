// Load leaderboard from localStorage or empty object
let leaderboard = JSON.parse(localStorage.getItem('lakdiLeaderboard')) || {};

// Utility: show or clear error message for an input field
function setError(playerNum, field, message) {
  document.getElementById(`error-${field}-${playerNum}`).textContent = message;
}

function clearErrors() {
  for(let i=1; i<=4; i++) {
    setError(i, 'call', '');
    setError(i, 'won', '');
  }
}

// Validate inputs: calls and tricks won must be between 2 and 13 inclusive
function validateInputs() {
  clearErrors();
  let valid = true;

  for(let i=1; i<=4; i++) {
    const callInput = document.getElementById(`call-${i}`);
    const wonInput = document.getElementById(`won-${i}`);
    const callVal = parseInt(callInput.value);
    const wonVal = parseInt(wonInput.value);

    if (isNaN(callVal) || callVal < 2 || callVal > 13) {
      setError(i, 'call', 'Enter value between 2 and 13');
      valid = false;
    }
    if (isNaN(wonVal) || wonVal < 2 || wonVal > 13) {
      setError(i, 'won', 'Enter value between 2 and 13');
      valid = false;
    }
  }
  return valid;
}

// Calculate points based on call & tricks won
// If tricks won >= call => points = tricks won
// else points = -call (penalty)
function calculatePoints(call, won) {
  if (won >= call) {
    return won;
  } else {
    return -call;
  }
}

// Save round scores and update leaderboard
function saveScores() {
  if(!validateInputs()) {
    alert("Please fix input errors before saving.");
    return;
  }

  for (let i = 1; i <= 4; i++) {
    const call = parseInt(document.getElementById(`call-${i}`).value);
    const won = parseInt(document.getElementById(`won-${i}`).value);
    const playerNameInput = document.getElementById(`name-${i}`);
    const playerName = playerNameInput.value.trim() || `Player ${i}`;

    const points = calculatePoints(call, won);

    if (!leaderboard[playerName]) {
      leaderboard[playerName] = { rounds: 0, points: 0 };
    }
    leaderboard[playerName].rounds += 1;
    leaderboard[playerName].points += points;
  }
  localStorage.setItem('lakdiLeaderboard', JSON.stringify(leaderboard));
  updateLeaderboardTable();
  alert('Scores saved!');
  resetInputs();
}

// Update leaderboard table UI
function updateLeaderboardTable() {
  const tbody = document.querySelector('#leaderboard-table tbody');
  tbody.innerHTML = '';
  // Convert leaderboard object to array and sort by points descending
  const sorted = Object.entries(leaderboard).sort((a, b) => b[1].points - a[1].points);

  for (const [player, data] of sorted) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${player}</td>
      <td>${data.rounds}</td>
      <td>${data.points}</td>
    `;
    tbody.appendChild(tr);
  }
}

// Reset call & tricks inputs to empty
function resetInputs() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`call-${i}`).value = '';
    document.getElementById(`won-${i}`).value = '';
  }
}

// Clear leaderboard data
function clearLeaderboard() {
  if(confirm('Are you sure you want to clear the leaderboard?')) {
    leaderboard = {};
    localStorage.removeItem('lakdiLeaderboard');
    updateLeaderboardTable();
  }
}

// Toggle leaderboard visibility
function toggleLeaderboard() {
  const table = document.getElementById('leaderboard-table');
  const title = document.getElementById('leaderboard-title');
  const btn = document.getElementById('toggleLeaderboardBtn');

  if(table.style.display === 'none' || table.style.display === '') {
    table.style.display = 'table';
    title.style.display = 'block';
    btn.textContent = 'Hide Leaderboard';
  } else {
    table.style.display = 'none';
    title.style.display = 'none';
    btn.textContent = 'Show Leaderboard';
  }
}

// Event listeners
document.getElementById('saveBtn').addEventListener('click', saveScores);
document.getElementById('clearBtn').addEventListener('click', clearLeaderboard);
document.getElementById('toggleLeaderboardBtn').addEventListener('click', toggleLeaderboard);

// Initialize leaderboard on page load
updateLeaderboardTable();
