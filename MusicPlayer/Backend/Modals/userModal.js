const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})
const userModal = mongoose.model('users', userSchema)
module.exports = userModal