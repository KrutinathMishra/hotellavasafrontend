import React, { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import { MdOutlineHotel } from "react-icons/md";
import { format, isSameMonth } from "date-fns";
import axios from "axios";
import { GlobalState } from "../../GlobalState";

const Dashboard = () => {
  const state = useContext(GlobalState);
  const [token, setToken] = state.token;

  const [bookingsMonth, setBookingsMonth] = useState();
  const [bookingsTotal, setBookingsTotal] = useState();
  const [amountMonth, setAmountMonth] = useState();
  const [amountTotal, setAmountTotal] = useState();
  const [gstMonth, setGstMonth] = useState();
  const [gstTotal, setGstTotal] = useState();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const sortedBookings = res.data.sort(
          (a, b) =>
            parseInt(b.booking_id.substring(2)) -
            parseInt(a.booking_id.substring(2))
        );
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
    const currentDate = new Date();
    let monthBookingsCount = 0;
    let totalBookingsCount = 0;
    let monthAmountSum = 0;
    let totalAmountSum = 0;
    let monthGstSum = 0;
    let totalGstSum = 0;

    bookings.forEach((booking) => {
      if (!booking.is_deleted) {
        const checkinDate = new Date(booking.checkin_date);

        // Check if the booking is in the current month
        if (isSameMonth(checkinDate, currentDate)) {
          monthBookingsCount++;
          monthAmountSum += booking.total_room_price;
          monthGstSum += booking.gst;
        }

        totalBookingsCount++;
        totalAmountSum += booking.total_room_price;
        totalGstSum += booking.gst;
      }
    });

    setBookingsMonth(monthBookingsCount);
    setBookingsTotal(totalBookingsCount);
    setAmountMonth(monthAmountSum);
    setAmountTotal(totalAmountSum);
    setGstMonth(monthGstSum);
    setGstTotal(totalGstSum);
  }, [bookings]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-heading">
        <h2>Welcome</h2>
      </div>
      <div className="dashboard-content">
        <div className="tiles-container">
          <div className="tiles-heading">
            <h3>This Month's Summary</h3>
          </div>
          <div className="dash-tiles">
            <div className="dash-tile">
              <div className="tile-left">
                <span className="tile-value">{bookingsMonth}</span>
                <span className="tile-name">Total Bookings</span>
              </div>
              <div className="tile-right">
                <MdOutlineHotel className="tile-icon" />
              </div>
            </div>
            <div className="dash-tile">
              <div className="tile-left">
                <span className="tile-value">₹ {amountMonth}</span>
                <span className="tile-name">Total Amount</span>
              </div>
              <div className="tile-right">
                <MdOutlineHotel className="tile-icon" />
              </div>
            </div>
            <div className="dash-tile">
              <div className="tile-left">
                <span className="tile-value">₹ {gstMonth}</span>
                <span className="tile-name">GST</span>
              </div>
              <div className="tile-right">
                <MdOutlineHotel className="tile-icon" />
              </div>
            </div>
          </div>
        </div>
        <div className="tiles-container">
          <div className="tiles-heading">
            <h3>Overall Summary</h3>
          </div>
          <div className="dash-tiles">
            <div className="dash-tile">
              <div className="tile-left">
                <span className="tile-value">{bookingsTotal}</span>
                <span className="tile-name">Total Bookings</span>
              </div>
              <div className="tile-right">
                <MdOutlineHotel className="tile-icon" />
              </div>
            </div>
            <div className="dash-tile">
              <div className="tile-left">
                <span className="tile-value">₹ {amountTotal}</span>
                <span className="tile-name">Total Amount</span>
              </div>
              <div className="tile-right">
                <MdOutlineHotel className="tile-icon" />
              </div>
            </div>
            <div className="dash-tile">
              <div className="tile-left">
                <span className="tile-value">₹ {gstTotal}</span>
                <span className="tile-name">GST</span>
              </div>
              <div className="tile-right">
                <MdOutlineHotel className="tile-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
