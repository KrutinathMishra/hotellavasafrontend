import React, { useContext, useState, useEffect } from "react";
import "./RoomStyle.css";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { GlobalState } from "../../GlobalState";

const EditRoom = () => {
  const state = useContext(GlobalState);
  const [token, setToken] = state.token;

  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (!token) {
      console.log("token not found");
      return;
    }
    const getRooms = async () => {
      try {
        const res = await axios.get("/room", {
          headers: { Authorization: token },
        });
        const sortedRooms = res.data.sort((a, b) => {
          const numA = parseInt(a.room_number);
          const numB = parseInt(b.room_number);
          return numA - numB;
        });
        setRooms((prevRooms) => {
          // Only update state if the data has changed to avoid unnecessary re-renders
          if (JSON.stringify(prevRooms) !== JSON.stringify(sortedRooms)) {
            return sortedRooms;
          }
          return prevRooms;
        });
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    getRooms();
  }, [token]);

  const [data, setData] = useState({
    type: "",
    occupied: "",
  });

  useEffect(() => {
    if (id) {
      const selectedRoom = rooms.find(
        (room) => room.room_number === parseInt(id)
      );
      if (selectedRoom) {
        setRoom(selectedRoom);
        setData({
          type: selectedRoom.type,
          occupied: selectedRoom.occupied ? "Occupied" : "Not Occupied",
        });
      }
    }
  }, [rooms, id]);

  const updateRoom = async (e) => {
    if (!token) {
      console.log("token not found");
      return;
    }
    e.preventDefault();
    const { type, occupied } = data;
    try {
      const response = await axios.put(
        `/room/${room.room_number}`,
        {
          type,
          occupied: occupied === "Occupied",
        },
        {
          headers: { Authorization: token },
        }
      );
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setData({ room_number: "", type: "", occupied: "" });
        toast.success("Update Successful.");
        window.location.replace("/admin/room");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRoomChange = (event) => {
    const selectedRoomNumber = event.target.value;
    if (selectedRoomNumber) {
      navigate(`/admin/room/edit_room/${selectedRoomNumber}`);
      // window.location.reload();
    }
  };

  return (
    <div className="room-page-container">
      <div className="page-heading">
        <h2>Edit Room</h2>
      </div>
      <div className="page-content">
        <div className="room-select">
          <h2>Select a Room</h2>
          <select
            value={id || ""}
            id="room-dropdown"
            onChange={handleRoomChange}
          >
            <option value="">--Select a Room--</option>
            {rooms.map((room) => (
              <option key={room.room_number} value={room.room_number}>
                {room.room_number}
              </option>
            ))}
          </select>
        </div>
        {room && (
          <div className="room-details">
            <h2>Room Details</h2>
            <br />
            <span>Room Number</span>
            <br />
            <span className="room-number">{room.room_number}</span>

            <form className="update-form" onSubmit={updateRoom}>
              <span>Type</span>
              <select
                value={data.type}
                onChange={(e) => setData({ ...data, type: e.target.value })}
              >
                <option value="">--Select Type--</option>
                <option value="Double">Superior Double Room</option>
                <option value="King">Deluxe King Room</option>
                <option value="Suite">Suite Room</option>
              </select>
              <span>Status</span>
              <select
                value={data.occupied}
                onChange={(e) => setData({ ...data, occupied: e.target.value })}
              >
                <option value="">--Select Status--</option>
                <option value="Occupied">Occupied</option>
                <option value="Not Occupied">Not Occupied</option>
              </select>
              <button className="room-button" type="submit">
                UPDATE
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditRoom;
