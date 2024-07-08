import React, { useContext, useState, useEffect } from "react";
import "./RoomStyle.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalState } from "../../GlobalState";

const AddRoom = () => {
  const state = useContext(GlobalState);
  const [token, setToken] = state.token;

  const [data, setData] = useState({
    room_number: "",
    type: "",
    occupied: "",
  });

  const addRoom = async (e) => {
    if (!token) {
      console.log("token not found");
      return;
    }
    e.preventDefault();
    const { room_number, type, occupied } = data;
    try {
      const response = await axios.post(
        "/room",
        {
          room_number,
          type,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setData({ room_number: "", type: "", occupied: "" });
        toast.success("Room Add Successful.");
        window.location.replace("/admin/room");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="room-page-container">
      <div className="page-heading">
        <h2>Add Room</h2>
      </div>
      <div className="page-content">
        <form className="update-form" onSubmit={addRoom}>
          <span>Room No:</span>
          <input
            type="text"
            placeholder="Enter Room No"
            value={data.room_number}
            onChange={(e) => setData({ ...data, room_number: e.target.value })}
          />
          <span>Type:</span>
          <select
            value={data.type}
            onChange={(e) => setData({ ...data, type: e.target.value })}
          >
            <option value="">--Select Type--</option>
            <option value="Double">Superior Double Room</option>
            <option value="King">Deluxe King Room</option>
            <option value="Suite">Suite Room</option>
          </select>
          <span>Status:</span>
          <select
            value={data.occupied}
            onChange={(e) => setData({ ...data, occupied: e.target.value })}
          >
            <option value="">--Select Status--</option>
            <option value="Occupied">Occupied</option>
            <option value="Not Occupied">Not Occupied</option>
          </select>
          <button className="room-button" type="submit">
            ADD ROOM
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
