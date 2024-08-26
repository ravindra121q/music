import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { toast } from "sonner";
import { MultiSelect } from "react-multi-select-component";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const Playlist = () => {
  const [modalShow, setModalShow] = useState(false);
  const [playLists, setPlayLists] = useState([]);
  const [editStatus, setEditStatus] = useState(false);
  const [viewItem, setViewItem] = useState({});
  const navigate = useNavigate();
  const auth = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  function MyVerticallyCenteredModal(props) {
    const [name, setName] = useState(viewItem?.name || "");
    const [songs, setSongs] = useState([]);
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState(
      viewItem?.songs?.map((song) => {
        return { value: song?._id, label: song?.name };
      }) || []
    );

    const getAllSongs = async () => {
      try {
        const response = await axios.get(
          "https://music-eight-alpha.vercel.app/api/v1/songs",
          auth
        );
        setSongs(response.data.data);
        setOptions(
          response.data.data.map((song) => {
            return { value: song._id, label: song.name };
          })
        );
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      getAllSongs();
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      console.log(token);
      try {
        const response = await axios.post(
          "https://music-eight-alpha.vercel.app/api/v1/playlist/create",
          { name, songs: selected?.map((item) => item.value) },
          auth
        );
        toast.success(response.data.message);
        getAllPlaylists();
        props.onHide();
      } catch (error) {
        console.log(error);
      }
    };
    const handleUpdate = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      try {
        const response = await axios.put(
          `https://music-eight-alpha.vercel.app/api/v1/playlist/update/${viewItem._id}`,
          { name, songs: selected?.map((item) => item.value) },
          auth
        );
        toast.success(response.data.message);
        getAllPlaylists();
        props.onHide();
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {editStatus ? "Edit Playlist" : "Create Playlist"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Playlist Name</Form.Label>
            <Form.Control
              value={name}
              className="mb-3"
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Playlist Name"
            />
            <MultiSelect
              options={options}
              value={selected}
              onChange={setSelected}
              labelledBy="Select"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
          <Button onClick={editStatus ? handleUpdate : handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const getAllPlaylists = async () => {
    try {
      const response = await axios.get(
        "https://music-eight-alpha.vercel.app/api/v1/playlist",
        auth
      );
      console.log(response);
      setPlayLists(response.data);
      props.onHide();
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    getAllPlaylists();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://music-eight-alpha.vercel.app/api/v1/playlist/${id}`,
        auth
      );
      toast.success(response.data.message);
      getAllPlaylists();
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  return (
    <div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />{" "}
      <div style={{ width: "40%", margin: "auto", textAlign: "center" }}>
        <h1>Playlist</h1>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span></span>
            <span
              style={{
                cursor: "pointer",
                borderRadius: "5px",
                padding: "0.5rem 1rem",
                fontWeight: "bold",
                backgroundColor: "#1B72E8",
                color: "white",
              }}
              onClick={() => {
                setModalShow(true);
                setEditStatus(false);
                setViewItem({});
              }}
            >
              Add Playlist
            </span>
          </div>
          <div style={{ marginTop: "1rem" }}>
            {playLists?.data?.map((playlist) => {
              return (
                <div
                  key={playlist._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "10px",
                  }}
                >
                  <span
                    key={playlist._id}
                    onClick={() =>
                      navigate(`/playlistsDetails/${playlist._id}`)
                    }
                    style={{
                      cursor: "pointer",
                      marginRight: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {playlist.name}
                  </span>
                  <span
                    style={{ cursor: "pointer", display: "flex", gap: "1rem" }}
                  >
                    <span>
                      <Icon
                        onClick={() => {
                          setModalShow(true);
                          setViewItem(playlist);
                          setEditStatus(true);
                        }}
                        icon="uil:edit"
                      />
                    </span>
                    <span>
                      <Icon
                        onClick={() => handleDelete(playlist._id)}
                        icon="fluent:delete-12-filled"
                      />
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
