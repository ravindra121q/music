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


const port = process.env.PORT || 5000

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1); 
});