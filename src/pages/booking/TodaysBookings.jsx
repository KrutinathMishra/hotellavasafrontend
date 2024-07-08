import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GlobalState } from "../../GlobalState";

const TodaysBookings = () => {
  const state = useContext(GlobalState);
  const [token, setToken] = state.token;

  const [bookings, setBookings] = useState([]);
  const [todaysBookings, setTodaysBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.log("token not found");
      return;
    }
    const getBookings = async () => {
      try {
        const res = await axios.get("/booking", {
          headers: { Authorization: token },
        });
        const sortedBookings = res.data.sort((a, b) => {
          const numA = parseInt(a.room_number);
          const numB = parseInt(b.room_number);
          return numA - numB;
        });
        setBookings(sortedBookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      }
    };

    getBookings();
  }, [token]);

  useEffect(() => {
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${year}-${month}-${day}`;
    };
    const isDateInRange = (todayDate, checkinDate, checkoutDate) => {
      // Subtract 1 day from checkout date
      const result = todayDate >= checkinDate && todayDate <= checkoutDate;
      return result;
    };
    const checkTodaysBookings = () => {
      const todayDate = new Date();

      let todaysList = bookings.filter((booking) => {
        const checkinDate = new Date(booking.checkin_date);
        const checkoutDate = new Date(booking.checkout_date);
        return isDateInRange(
          formatDate(todayDate),
          formatDate(checkinDate),
          formatDate(checkoutDate)
        );
      });
      setTodaysBookings(todaysList);
    };
    checkTodaysBookings();
  }, [bookings]);

  const deleteBooking = async (bookingId) => {
    // Ask for confirmation
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) {
      return; // Cancel deletion
    }
    if (!token) {
      console.log("token not found");
      return;
    }
    try {
      const response = await axios.delete(`/booking/${bookingId}`, {
        headers: { Authorization: token },
      });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Booking deleted successfully.");
        window.location.replace("/admin/booking");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="booking-page-container">
      <div className="booking-page-heading">
        <h2>Today's Bookings</h2>
        <button
          className="add-booking-button"
          onClick={() => navigate("/admin/booking/add_booking")}
        >
          Add Booking
        </button>
      </div>
      <div className="page-content">
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Booked On</th>
                <th>Name</th>
                {/* <th>Booking Date</th> */}
                <th>Check-in Date</th>
                <th>Check-out Date</th>
                <th>Room No.</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {todaysBookings.map(
                (booking, index) =>
                  !booking.is_deleted && (
                    <tr key={booking.booking_id}>
                      <td>{booking.booking_id}</td>
                      <td>{booking.booked_on}</td>
                      <td>
                        {booking.customer_firstname +
                          " " +
                          booking.customer_lastname}
                      </td>
                      {/* <td>{formatDate(booking.booking_date)}</td> */}
                      <td>{formatDate(booking.checkin_date)}</td>
                      <td>{formatDate(booking.checkout_date)}</td>
                      <td>{booking.room_number}</td>
                      <td>
                        <div
                          className={`booking-status ${
                            booking.booking_status != "Checked Out"
                              ? booking.booking_status == "Reserved"
                                ? "reservedB"
                                : "checkedinB"
                              : ""
                          } `}
                        >
                          {booking.booking_status}
                        </div>
                      </td>
                      <td className="btn-column">
                        <button
                          className="booking-action-btn"
                          onClick={() =>
                            navigate(
                              `/admin/booking/print/${booking.booking_id}`,
                              { state: { booking: booking } }
                            )
                          }
                        >
                          Print
                        </button>
                        <button
                          className="booking-action-btn"
                          onClick={() =>
                            navigate(
                              `/admin/booking/edit_booking/${booking.booking_id}`
                            )
                          }
                        >
                          Edit
                        </button>

                        <div className="dropdown">
                          <button className="dropbtn">Actions</button>
                          <div className="dropdown-content">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/booking/view_booking/${booking.booking_id}`
                                )
                              }
                            >
                              View
                            </button>
                            <button
                              onClick={() => deleteBooking(booking.booking_id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TodaysBookings;
