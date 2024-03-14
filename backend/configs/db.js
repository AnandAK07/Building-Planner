const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("mongoDB is connected")
    } catch (error) {
        console.log("mongoDB is not failure")
    }
}

module.exports = connection