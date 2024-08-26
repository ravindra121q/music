import { Routes, Route } from "react-router-dom";
import SignUpPage from "../Component/Auth/SignUpPage";
import SignInPage from "../Component/Auth/SignInPage";
import MusicPlayer from "../Component/Player/MusicPlayer";
import Dashboard from "../Pages/Dashboard";
import Playlist from "../Component/Playlist/Playlist";
import PlaylistDetails from "../Pages/PlaylistDetails";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/music" element={<MusicPlayer />} />
      <Route path="/playlists" element={<Playlist />} />
      <Route
        path="/playlistsDetails/:playlistId"
        element={<PlaylistDetails />}
      />
    </Routes>
  );
};

export default AllRoutes;
