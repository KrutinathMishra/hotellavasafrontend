import React, { useState, useEffect, useContext } from "react";
import "./RoomStyle.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GlobalState } from "../../GlobalState";

const AllRooms = () => {
  const state = useContext(GlobalState);
  const [token, setToken] = state.token;
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
        setRooms(sortedRooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    getRooms();
  }, [token]);
  const navigate = useNavigate();

  const deleteRoom = async (roomNumber) => {
    // Ask for confirmation
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );
    if (!confirmDelete) {
      return; // Cancel deletion
    }

    try {
      const response = await axios.delete(`/room/${roomNumber}`, {
        headers: { Authorization: token },
      });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Room deleted successfully.");
        window.location.replace("/admin/room");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="room-page-container">
      <div className="page-heading">
        <h2>All Rooms</h2>
        <button
          className="add-room-button"
          onClick={() => navigate("/admin/room/add_room")}
        >
          Add Room
        </button>
      </div>
      <div className="page-content">
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr key={room.room_number}>
                  <td>{room.room_number}</td>
                  <td>{room.type}</td>
                  <td>{room.occupied ? "Occupied" : "Available"}</td>
                  <td>
                    <button
                      className="room-button"
                      onClick={() => {
                        navigate(`/admin/room/edit_room/${room.room_number}`);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="room-button"
                      onClick={() => deleteRoom(room.room_number)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
