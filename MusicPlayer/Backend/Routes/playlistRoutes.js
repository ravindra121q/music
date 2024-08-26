const express = require('express');
const playlistRouter = express.Router();
const { createPlaylist ,getPlaylists, deletePlaylist,addSongsToPlaylist,removeSongsToPlaylist, createPlaylistwithsongs, updatedPlaylistwithsongs, getSongsByPlaylistId} = require('../Controller/controller');
const { authMiddleware } = require('../Middleware/authMiddleware');


playlistRouter.get('/', authMiddleware,getPlaylists);
playlistRouter.post('/', authMiddleware, createPlaylist);
playlistRouter.delete('/:id', authMiddleware, deletePlaylist);
playlistRouter.put('/:playlistId', authMiddleware, addSongsToPlaylist)
playlistRouter.delete('/:playlistId', authMiddleware, removeSongsToPlaylist)
playlistRouter.post('/create', authMiddleware, createPlaylistwithsongs)
playlistRouter.put('/update/:id', authMiddleware, updatedPlaylistwithsongs)
playlistRouter.get('/:id', authMiddleware, getSongsByPlaylistId)







module.exports = playlistRouter