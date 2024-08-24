const express = require('express');
const songRouter = express.Router();

const { getSongs, addSongs, deleteSong, updateSong } = require('../Controller/controller');
const { authMiddleware } = require('../Middleware/authMiddleware');

songRouter.get('/', getSongs);    
songRouter.post('/', addSongs);    
songRouter.delete('/:id', authMiddleware, deleteSong); 
songRouter.put('/:id', authMiddleware, updateSong);  

module.exports = songRouter;
