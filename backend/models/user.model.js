const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    timestamps: {
        type: Schema.Types.Date,
        default: Date.now,
        immutable: true,
        required: true,
    }
})

const userModel = mongoose.model("User", userSchema)

module.exports = userModel