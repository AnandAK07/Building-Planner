const express = require('express');
const drawing = express.Router();
const { getAllDrawing, addDrawing, removeDrawing } = require('../controllers/drawingController');


drawing.get('/', getAllDrawing);
drawing.post('/create', addDrawing);
drawing.delete('/remove', removeDrawing);


module.exports = drawing;