import React from "react";
import { Route, Routes } from "react-router-dom";
import AllRooms from "../pages/room/AllRooms";
import Dashboard from "./dashboard/Dashboard";
import AddRoom from "./room/AddRoom";
import Calendar from "../components/calendar/Calendar";
import EditRoom from "./room/EditRoom";
import AllBooking from "./booking/AllBooking";
import AddBooking from "./booking/AddBooking";
import EditBooking from "./booking/EditBooking";
import ViewBooking from "./booking/ViewBooking";
import TodaysBookings from "./booking/TodaysBookings";
import BillPrint from "./booking/BillPrint";

const Pages = () => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/room" element={<AllRooms />} />
        <Route path="/room/add_room" element={<AddRoom />} />
        <Route path="/room/edit_room/:id" element={<EditRoom />} />
        <Route path="/room/edit_room" element={<EditRoom />} />

        <Route path="/booking" element={<AllBooking />} />
        <Route path="/booking/add_booking" element={<AddBooking />} />
        <Route path="/booking/edit_booking/:id" element={<EditBooking />} />
        <Route path="/booking/edit_booking" element={<EditBooking />} />
        <Route path="/booking/view_booking/:id" element={<ViewBooking />} />
        <Route path="/booking/todays_bookings" element={<TodaysBookings />} />
        <Route path="/booking/print/:id" element={<BillPrint />} />

        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </div>
  );
};

export default Pages;
