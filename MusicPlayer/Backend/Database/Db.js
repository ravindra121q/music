const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    const mongoUrl=process.env.MONGO_URL
    try {
        const connection = await mongoose.connect(mongoUrl);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;
