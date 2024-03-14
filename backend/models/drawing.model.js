const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const drawingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    drawing: {type: String,required:true},
    timestamps: {
        type: Schema.Types.Date,
        default: Date.now,
        immutable: true,
        required: true,
    }
})

const drawingModel = mongoose.model("Drawing", drawingSchema)

module.exports = drawingModel