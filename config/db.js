const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB".bgMagenta.white);
    } catch (error) {
        console.log(`Mongo Connect Error ${error}`.bgRed.white);
    }
}

module.exports = connectDB;