const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModal = require('../Modals/userModal');
const songModal = require('../Modals/songsModal');
const playlistModel = require('../Modals/playlistsModal');


exports.signup = async (req, res) => {
    const { email, password } = req.body;
    try {


        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const userExists = await userModal.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'User already exists' })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new userModal({
            email,
            password: hashPassword
        })

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })

    }

}


exports.signin = async (req, res) => {
    const { email, password } = req.body;
    const userExists = await userModal.findOne({ email });
    if (!userExists) {
        return res.status(404).json({ message: 'User not found' })
    }
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token = jwt.sign({ userId: userExists._id }, process.env.SECRET_KEY);
    res.status(200).json({ message: 'Login successful', token })
}



exports.getSongs = async (req, res) => {
    try {
        const songs = await songModal.find();
        if (songs?.length === 0) {
            return res.status(404).json({ message: 'No songs found' });
        }
        return res.status(200).json({ data: songs });
    } catch (error) {
        console.error('Error fetching songs:', error.message);
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}



exports.addSongs = async (req, res) => {
    const { name, link, duration } = req.body;
    try {

        if (!name || !link || !duration) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const newSong = new songModal({
            name,
            link,
            duration
        })
        await newSong.save();
        return res.status(201).json({ message: 'Song added successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

exports.deleteSong = async (req, res) => {
    const { id } = req.params;
    try {
        await songModal.findByIdAndDelete(id);
        res.status(200).json({ message: 'Song deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

exports.updateSong = async (req, res) => {
    const { id } = req.params;
    const { name, path, album, artist, genre, duration } = req.body;
    try {
        await songModal.findByIdAndUpdate(id, {
            name,
            path,
            album,
            artist,
            genre,
            duration
        })
        return res.status(200).json({ message: 'Song updated successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' })
    }
}


exports.getPlaylists = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const playlists = await playlistModel.find({ user: decoded.userId }).populate('songs');
        if (!playlists || playlists.length === 0) {
            return res.status(404).json({ message: 'No playlists found for this user' });
        }

        return res.status(200).json({ data: playlists });
    } catch (error) {
        console.error('Error fetching playlists:', error);
        return res.status(500).json({ message: 'Something went wrong while fetching playlists' });
    }
};


exports.createPlaylist = async (req, res) => {
    const { name } = req.body;

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const newPlaylist = new playlistModel({
            name,
            user: decoded.userId
        });
        await newPlaylist.save();
        return res.status(201).json({ message: 'Playlist created successfully' });
    } catch (error) {
        console.error('Error creating playlist:', error);
        return res.status(500).json({ message: 'Something went wrong while creating playlist' });
    }
}

exports.createPlaylistwithsongs = async (req, res) => {
    const { name, songIds } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    const userId = decoded.userId;
    try {
        const newPlaylist = new playlistModel({
            name,
            songs: songIds,
            user: userId
        });
        await newPlaylist.save();
        return res.status(201).json({ message: 'Playlist created successfully' });
    } catch (error) {
        console.error('Error creating playlist:', error);
        return res.status(500).json({ message: 'Something went wrong while creating playlist' });
    }
}

exports.updatedPlaylistwithsongs = async (req, res) => {
    const { id } = req.params;
    
    const { name, songs } = req.body;
    try {
        await playlistModel.findByIdAndUpdate(id, {
            name,
            songs
        })
        return res.status(200).json({ message: 'Playlist updated successfully', data: { id, name, songs } });
    } catch (error) {
        console.error('Error updating playlist:', error);
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

exports.getSongsByPlaylistId = async (req, res) => {
    const { id } = req.params;
    try {
        const playlist = await playlistModel.findById({ _id: id }).populate('songs');
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        return res.status(200).json({ data: playlist.songs });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' })
    }
}
exports.deletePlaylist = async (req, res) => {
    const { id } = req.params;
    try {
        await playlistModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Playlist deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

exports.addSongsToPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { songIds } = req.body;
    try {
        const playlist = await playlistModel.findById({ _id: playlistId });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        const existingSongs = playlist.songs.map(song => song.toString());
        const newSongs = songIds.filter(songId => !existingSongs.includes(songId));

        if (newSongs.length === 0) {
            return res.status(400).json({ message: 'All the provided songs are already in the playlist' });
        }

        const updatedPlaylist = await playlistModel.findByIdAndUpdate(
            playlistId,
            { $push: { songs: { $each: newSongs } } },
            { new: true }
        );

        return res.status(200).json({ message: 'Songs added to playlist successfully', data: updatedPlaylist });
    } catch (error) {
        console.error('Error adding songs to playlist:', error);
        return res.status(500).json({ message: 'Something went wrong while adding songs to playlist' });
    }
};


exports.removeSongsToPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { songIds } = req.body;
    try {
        const playlist = await playlistModel.findById({ _id: playlistId });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        const existingSongs = playlist.songs.map(song => song.toString());
        const newSongs = songIds.filter(songId => !existingSongs.includes(songId));

        if (newSongs.length === 0) {
            return res.status(400).json({ message: 'All the provided songs are not in the playlist' });
        }

        const updatedPlaylist = await playlistModel.findByIdAndUpdate(
            playlistId,
            { $pull: { songs: { $in: newSongs } } },
            { new: true }
        );

        return res.status(200).json({ message: 'Songs removed from playlist successfully', data: updatedPlaylist });
    } catch (error) {
        console.error('Error removing songs from playlist:', error);
        return res.status(500).json({ message: 'Something went wrong while removing songs from playlist' });
    }
}
