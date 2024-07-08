import React, { useState, useEffect, useContext } from "react";
import "./Calendar.css";
import axios from "axios";
import { GlobalState } from "../../GlobalState";

const Calendar = () => {
  const state = useContext(GlobalState);
  const [token, setToken] = state.token;

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [bookings, setBookings] = useState({});
  const [bookingData, setBookingData] = useState([]);
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
        setBookingData(sortedBookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      }
    };

    getBookings();
  }, [token]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const transformBookings = () => {
      const transformed = {};

      bookingData.forEach((booking) => {
        if (!booking.is_deleted) {
          const {
            room_number,
            checkin_date,
            checkout_date,
            booking_status,
            booking_id,
          } = booking;
          let currentDate = new Date(checkin_date);
          const adjustedCheckoutDate = new Date(checkout_date);
          adjustedCheckoutDate.setDate(adjustedCheckoutDate.getDate() - 1);

          while (currentDate <= adjustedCheckoutDate) {
            const dateKey = currentDate.toISOString().split("T")[0];

            if (!transformed[dateKey]) {
              transformed[dateKey] = {};
            }

            transformed[dateKey][room_number] = {
              booking_status,
              booking_id, // Store booking_id along with room status
            };

            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      });

      setBookings(transformed);
    };

    transformBookings();
  }, [bookingData]);

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty"></div>);
    }

    for (let day = 1; day <= lastDate; day++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const roomStatuses = bookings[dateKey] || {};

      const dayContent = (
        <div key={day} className="day">
          <div className="day-number">{day}</div>
          <div className="rooms">
            {[...Array(9)].map((_, index) => {
              const roomNumber = `10${index + 1}`;
              const { booking_status, booking_id } =
                roomStatuses[roomNumber] || {};
              const status = booking_status || "available";

              return (
                <div
                  key={index}
                  className={`room ${status}`}
                  title={
                    booking_id ? `Booking ID: ${booking_id}` : "No booking"
                  }
                >
                  {roomNumber}
                </div>
              );
            })}
          </div>
        </div>
      );

      days.push(dayContent);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1);
    setCurrentYear(currentMonth === 0 ? currentYear - 1 : currentYear);
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1);
    setCurrentYear(currentMonth === 11 ? currentYear + 1 : currentYear);
  };

  return (
    <div className="calendar-container">
      <div className="calendar">
        <div className="month">
          <div className="prev" onClick={handlePrevMonth}>
            &#10094;
          </div>
          <div className="month-name">{`${monthNames[currentMonth]} ${currentYear}`}</div>
          <div className="next" onClick={handleNextMonth}>
            &#10095;
          </div>
        </div>
        <div className="weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="days">{generateCalendar()}</div>
      </div>
    </div>
  );
};

export default Calendar;
