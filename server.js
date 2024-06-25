const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get the leaderboard data
app.get('/leaderboard', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'data.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        res.send(JSON.parse(data));
    });
});

// Endpoint to save the leaderboard data
app.post('/leaderboard', (req, res) => {
    const newData = JSON.stringify(req.body, null, 2);
    fs.writeFile(path.join(__dirname, 'public', 'data.json'), newData, 'utf8', (err) => {
        if (err) {
            res.status(500).send('Error writing file');
            return;
        }
        res.send('Data saved successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
