import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

const MusicPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [progress, setProgress] = useState({});
  const params = useParams();

  const audioRefs = useRef([]);
  const auth = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const getAllSongs = async () => {
    try {
      const response = await axios.get(
        `https://music-eight-alpha.vercel.app/api/v1/songs`,
        auth
      );
      setSongs(response.data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  useEffect(() => {
    getAllSongs();
    const savedProgress =
      JSON.parse(localStorage.getItem("songProgress")) || {};
    setProgress(savedProgress);
  }, [params.playlistId]);

  useEffect(() => {
    localStorage.setItem("songProgress", JSON.stringify(progress));
  }, [progress]);

  const handlePlayPause = (index) => {
    const currentAudioRef = audioRefs.current[index];

    if (currentAudioRef) {
      if (currentSongIndex !== index) {
        // Pause currently playing song if needed
        if (currentSongIndex !== null && audioRefs.current[currentSongIndex]) {
          audioRefs.current[currentSongIndex].pause();
        }

        setCurrentSongIndex(index);
        setIsPlaying(true);
        currentAudioRef.currentTime = progress[index]?.currentTime || 0;
        currentAudioRef.play();
      } else {
        if (isPlaying) {
          currentAudioRef.pause();
          setIsPlaying(false);
        } else {
          currentAudioRef.play();
          setIsPlaying(true);
        }
      }
    }
  };

  const handleTimeUpdate = (index) => {
    const currentAudioRef = audioRefs.current[index];
    if (currentAudioRef) {
      const currentTime = currentAudioRef.currentTime;
      const duration = currentAudioRef.duration;

      setProgress((prevProgress) => ({
        ...prevProgress,
        [index]: { currentTime, duration },
      }));
    }
  };

  const handleProgressChange = (index, e) => {
    const currentAudioRef = audioRefs.current[index];
    const newTime = parseFloat(e.target.value);
    if (currentAudioRef) {
      currentAudioRef.currentTime = newTime;
      setProgress((prevProgress) => ({
        ...prevProgress,
        [index]: { ...prevProgress[index], currentTime: newTime },
      }));
    }
  };

  return (
    <div style={{ marginTop: "4rem" }}>
      {songs?.data?.map((song, index) => (
        <div key={index} className="music-player">
          <div className="player-info">
            <h1 className="song-title">{song.name}</h1>
          </div>
          <div className="controls">
            <button
              className="play-pause-btn"
              onClick={() => handlePlayPause(index)}
            >
              {isPlaying && currentSongIndex === index ? "Pause" : "Play"}
            </button>
            <div className="progress-bar-container">
              <input
                type="range"
                min="0"
                max={progress[index]?.duration || 0}
                value={progress[index]?.currentTime || 0}
                onChange={(e) => handleProgressChange(index, e)}
                className="progress-bar"
                step="0.1"
              />
            </div>
          </div>
          <audio
            ref={(el) => (audioRefs.current[index] = el)}
            src={song.link}
            onTimeUpdate={() => handleTimeUpdate(index)}
            onLoadedMetadata={() => {
              // Update progress duration when metadata is loaded
              const currentAudioRef = audioRefs.current[index];
              if (currentAudioRef) {
                const duration = currentAudioRef.duration;
                setProgress((prevProgress) => ({
                  ...prevProgress,
                  [index]: { ...prevProgress[index], duration },
                }));
              }
            }}
            onEnded={() => {
              setIsPlaying(false);
              setProgress((prev) => ({
                ...prev,
                [index]: { ...prev[index], currentTime: 0 },
              }));
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default MusicPlayer;
