const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/snakegame');

const scoreSchema = new mongoose.Schema({
    name: String,
    score: Number,
    date: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

app.post('/api/scores', async (req, res) => {
    const { name, score } = req.body;
    const newScore = new Score({ name, score });
    await newScore.save();
    res.sendStatus(201);
});

app.get('/api/scores', async (req, res) => {
    const scores = await Score.find().sort({ score: -1 }).limit(10);
    res.json(scores);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
