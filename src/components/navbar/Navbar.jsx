import React, { useEffect, useState, useContext } from "react";
import "./Navbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalState } from "../../GlobalState";

const Navbar = () => {
  const state = useContext(GlobalState);
  const [token, setToken] = state.token;

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoutUserValue, setLogoutUserValue] = useState(false);
  const [unavailableRooms, setUnavailableRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.log("token not found");
      return;
    }
    const fetchData = async () => {
      try {
        const [roomsRes, bookingsRes, customersRes] = await Promise.all([
          axios.get("/room", {
            headers: { Authorization: token },
          }),
          axios.get("/booking", {
            headers: { Authorization: token },
          }),
        ]);

        const sortedRooms = roomsRes.data.sort(
          (a, b) => parseInt(a.room_number) - parseInt(b.room_number)
        );
        const sortedBookings = bookingsRes.data.sort(
          (a, b) =>
            parseInt(a.booking_id.substring(2)) -
            parseInt(b.booking_id.substring(2))
        );

        setRooms(sortedRooms);
        setBookings(sortedBookings);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (!loading) {
      const isDateInRange = (todayDate, checkinDate, checkoutDate) => {
        const result = todayDate >= checkinDate && todayDate < checkoutDate;
        return result;
      };

      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
      };

      const checkUnavailableRooms = () => {
        const todayDate = new Date();

        let unavailableRoom = [];

        bookings.forEach((booking) => {
          const checkinDate = new Date(booking.checkin_date);
          const checkoutDate = new Date(booking.checkout_date);

          if (
            isDateInRange(
              formatDate(todayDate),
              formatDate(checkinDate),
              formatDate(checkoutDate)
            ) &&
            booking.booking_status != "Checked Out" &&
            booking.is_deleted == false
          ) {
            unavailableRoom.push({
              room_number: booking.room_number,
              booking_status: booking.booking_status,
            });
          }
        });
        setUnavailableRooms(unavailableRoom);
      };
      checkUnavailableRooms();
    }
  }, [bookings]);

  useEffect(() => {
    if (!token) {
      console.log("token not found");
      return;
    }
    const logoutUser = async () => {
      try {
        if (logoutUserValue) {
          setLogoutUserValue(false);
          await axios.get("/user/logout", {
            headers: { Authorization: token },
          });
          localStorage.clear();
          navigate("/admin/login");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };
    logoutUser();
  }, [logoutUserValue]);

  return (
    <nav className="navbar">
      <ul className="tile-list">
        {rooms.map((room, index) => (
          <li className="tiles" key={index}>
            <div
              className={`tile-container ${
                unavailableRooms.some(
                  (rooms) => rooms.room_number === room.room_number
                )
                  ? unavailableRooms.find(
                      (rooms) => rooms.room_number === room.room_number
                    ).booking_status === "Reserved"
                    ? "reserved"
                    : "occupied"
                  : ""
              }`}
            >
              {room.room_number}
            </div>
          </li>
        ))}
      </ul>
      <button
        className="logout-button"
        onClick={() => {
          setLogoutUserValue(true);
        }}
      >
        Logout
      </button>
      <hr className="divider" />
    </nav>
  );
};

export default Navbar;
