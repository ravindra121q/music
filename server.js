const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const connectDB = require('./Database/Db');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World')
})
app.use('/auth', require('./Routes/authRoutes'));
app.use('/songs', require('./Routes/songsRoutes'));
app.use('/playlist', require('./Routes/playlistRoutes'));


const port = process.env.PORT || 5000;

app.listen(port, () => {
    connectDB();
})