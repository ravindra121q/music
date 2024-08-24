const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true
    },
   
    duration: {
        type: String,
        required: true
    }
})
const songModal = mongoose.model('songs', songSchema)
module.exports = songModal