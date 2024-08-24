const express = require('express');
const playlistRouter = express.Router();
const { createPlaylist ,getPlaylists, deletePlaylist,addSongsToPlaylist,removeSongsToPlaylist} = require('../Controller/controller');
const { authMiddleware } = require('../Middleware/authMiddleware');


playlistRouter.get('/', authMiddleware,getPlaylists);
playlistRouter.post('/', authMiddleware, createPlaylist);
playlistRouter.delete('/:id', authMiddleware, deletePlaylist);
playlistRouter.put('/:playlistId', authMiddleware, addSongsToPlaylist)
playlistRouter.delete('/:playlistId', authMiddleware, removeSongsToPlaylist)






module.exports = playlistRouter