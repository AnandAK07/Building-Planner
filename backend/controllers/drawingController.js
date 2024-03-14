const userModel = require('../models/user.model');
const drawingModel = require('../models/drawing.model');

const getAllDrawing = async (req, res) => {
    const { userId } = req.body;

    try {
        const drawing = await drawingModel.find({userId});
        res.status(200).json(drawing);
    } catch (error) {
        console.log('Error fetching drawing:', error);
        res.status(500).json({ message: 'Error fetching drawing items' });
    }
}

const addDrawing = async (req, res) => {
    const { userId, imgUrl } = req.body;
    if (!imgUrl) {
        return res.status(400).json({ error: 'imgUrl is missing from the request body' });
    }

    try {
        const drawing = await new drawingModel({ userId: userId, drawing :imgUrl});
        drawing.save();
        res.status(200).json({ message: 'Drawing added successfully' })
    } catch (error) {
        console.log('Error adding drawing database:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}


const removeDrawing = async (req, res) => {
    try {
        const { userId, imgUrl } = req.body;

        await drawingModel.findOneAndDelete({ userId: userId,drawing:imgUrl})

        res.status(200).json({ message: 'Drawing removed from database' });
    } catch (error) {
        console.log('Error removing drawing from database:', error);
        res.status(500).json({ error: 'An error occured' })
    }
}



module.exports = { getAllDrawing, addDrawing, removeDrawing };