import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div style={{ width: "40%", margin: "auto" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "5rem",
          gap: "3rem",
          fontSize: "1.5rem",
          cursor: "pointer",
        }}
      >
        <span onClick={() => navigate("/music")}>All Songs </span>
        <span onClick={() => navigate("/playlists")}>Playlists Page</span>
      </div>
    </div>
  );
};

export default Dashboard;
