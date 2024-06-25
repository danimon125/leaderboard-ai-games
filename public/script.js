let users = [];

async function fetchLeaderboard() {
    const response = await fetch('/leaderboard');
    users = await response.json();
    renderLeaderboard();
}

function renderLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    const pointsInputs = document.getElementById('pointsInputs');
    leaderboard.innerHTML = '';
    pointsInputs.innerHTML = '';

    users.sort((a, b) => b.total_points - a.total_points);

    users.forEach((user, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        item.innerHTML = `
            <span class="rank">${index + 1}</span>
            <span class="teamname">${user.name}</span>
            <span class="points-added">${user.last_round_points}</span>
            <span class="total-points">${user.total_points}</span>
        `;
        leaderboard.appendChild(item);

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'points-input';
        input.placeholder = 'Punkte';
        input.onchange = function() { updatePoints(index, this.value); };
        pointsInputs.appendChild(input);
    });
}

function updatePoints(index, pointsAdded) {
    pointsAdded = parseInt(pointsAdded);
    if (!isNaN(pointsAdded)) {
        users[index].last_round_points = pointsAdded;
        users[index].total_points += pointsAdded;
        renderLeaderboard();
    }
}

async function resetPoints() {
    users.forEach(user => {
        user.last_round_points = 0;
        user.total_points = 0;
    });
    await saveToFile();
    renderLeaderboard();
}

async function saveToFile() {
    await fetch('/leaderboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(users)
    });
}

fetchLeaderboard();
