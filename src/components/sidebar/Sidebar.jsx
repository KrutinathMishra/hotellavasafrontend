import React, { useState, useContext } from "react";
import { FaRegCalendarAlt, FaUserTie } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import { TfiMenu } from "react-icons/tfi";
import { MdLocalHotel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { GlobalState } from "../../GlobalState";

import "./Sidebar.css";

const Sidebar = () => {
  const state = useContext(GlobalState);
  const [sidebarCollapsed, setSidebarCollapsed] = state.sidebarCollapsed;
  const navigate = useNavigate();

  const [bookingDropdownVisible, setBookingDropdownVisible] = useState(false);
  const [roomDropdownVisible, setRoomDropdownVisible] = useState(false);

  const [selectedSubMenu, setSelectedSubMenu] = useState("");

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleBookingDropdown = () => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
    setBookingDropdownVisible(!bookingDropdownVisible);
    if (!bookingDropdownVisible) {
      setRoomDropdownVisible(false);
    }
  };

  const toggleRoomDropdown = () => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
    setRoomDropdownVisible(!roomDropdownVisible);
    if (!roomDropdownVisible) {
      setBookingDropdownVisible(false);
    }
  };

  const handleSubMenuClick = (subMenu) => {
    if (selectedSubMenu === "Dashboard" && subMenu !== "Dashboard") {
      setSelectedSubMenu("");
    } else {
      setSelectedSubMenu(subMenu);
    }
  };

  return (
    <div
      className={
        sidebarCollapsed ? "sidebar-container collapsed" : "sidebar-container"
      }
    >
      <div className="hotel-logo">
        <a
          className="collapse"
          onClick={() => {
            toggleSidebarCollapsed();
          }}
        >
          <TfiMenu className="collapse-icon" />
        </a>
      </div>
      <div
        className="sidebar-dashboard"
        style={{
          backgroundColor:
            selectedSubMenu === "Dashboard" ? "var(--color-secondary)" : "",
        }}
      >
        <a
          style={{
            color: selectedSubMenu === "Dashboard" ? "#fff" : "",
          }}
          onClick={() => {
            handleSubMenuClick("Dashboard");
            navigate("/admin");
          }}
        >
          <LuLayoutDashboard className="sidebar-icon" />
          {!sidebarCollapsed && <span>Dashboard</span>}
        </a>
      </div>
      <hr className="divider" />
      <div className="sidebar-routes">
        <ul className="route-lists">
          <li
            className="main-menu"
            style={{
              backgroundColor: bookingDropdownVisible
                ? "var(--color-secondary)"
                : "",
            }}
          >
            <a
              className="routes"
              style={{
                color: bookingDropdownVisible ? "#fff" : "",
              }}
              onClick={toggleBookingDropdown}
            >
              <div className="routes-left">
                <MdLocalHotel className="icon" />
                {!sidebarCollapsed && <span>Booking</span>}
              </div>
              {!sidebarCollapsed && (
                <div className="routes-right">
                  {bookingDropdownVisible ? (
                    <IoIosArrowDropup className="icon" />
                  ) : (
                    <IoIosArrowDropdown className="icon" />
                  )}
                </div>
              )}
            </a>
          </li>
          {!sidebarCollapsed && (
            <li className="sub-menu">
              {bookingDropdownVisible && (
                <ul className="dropdown-list">
                  <li
                    style={{
                      backgroundColor:
                        selectedSubMenu === "AllBooking"
                          ? "var(--color-secondary)"
                          : "",
                    }}
                  >
                    <a
                      className="dropdown-item"
                      style={{
                        color: selectedSubMenu === "AllBooking" ? "#fff" : "",
                      }}
                      onClick={() => {
                        handleSubMenuClick("AllBooking");
                        navigate("/admin/booking");
                      }}
                    >
                      All Bookings
                    </a>
                  </li>
                  <li
                    style={{
                      backgroundColor:
                        selectedSubMenu === "AddBooking"
                          ? "var(--color-secondary)"
                          : "",
                    }}
                  >
                    <a
                      className="dropdown-item"
                      style={{
                        color: selectedSubMenu === "AddBooking" ? "#fff" : "",
                      }}
                      onClick={() => {
                        handleSubMenuClick("AddBooking");
                        navigate("/admin/booking/add_booking");
                      }}
                    >
                      Add Booking
                    </a>
                  </li>
                  <li
                    style={{
                      backgroundColor:
                        selectedSubMenu === "TodayBooking"
                          ? "var(--color-secondary)"
                          : "",
                    }}
                  >
                    <a
                      className="dropdown-item"
                      style={{
                        color: selectedSubMenu === "TodayBooking" ? "#fff" : "",
                      }}
                      onClick={() => {
                        handleSubMenuClick("TodayBooking");
                        navigate("/admin/booking/todays_bookings");
                      }}
                    >
                      Today's Bookings
                    </a>
                  </li>
                </ul>
              )}
            </li>
          )}
          <li
            className="main-menu"
            style={{
              backgroundColor: roomDropdownVisible
                ? "var(--color-secondary)"
                : "",
            }}
          >
            <a
              className="routes"
              style={{
                color: roomDropdownVisible ? "#fff" : "",
              }}
              onClick={toggleRoomDropdown}
            >
              <div className="routes-left">
                <FaKey className="icon" />
                {!sidebarCollapsed && <span>Room</span>}
              </div>
              {!sidebarCollapsed && (
                <div className="routes-right">
                  {roomDropdownVisible ? (
                    <IoIosArrowDropup className="icon" />
                  ) : (
                    <IoIosArrowDropdown className="icon" />
                  )}
                </div>
              )}
            </a>
          </li>
          {!sidebarCollapsed && (
            <li className="sub-menu">
              {roomDropdownVisible && (
                <ul className="dropdown-list">
                  <li
                    style={{
                      backgroundColor:
                        selectedSubMenu === "AllRooms"
                          ? "var(--color-secondary)"
                          : "",
                    }}
                  >
                    <a
                      className="dropdown-item"
                      style={{
                        color: selectedSubMenu === "AllRooms" ? "#fff" : "",
                      }}
                      onClick={() => {
                        handleSubMenuClick("AllRooms");
                        navigate("/admin/room");
                      }}
                    >
                      All Rooms
                    </a>
                  </li>
                  <li
                    style={{
                      backgroundColor:
                        selectedSubMenu === "AddRoom"
                          ? "var(--color-secondary)"
                          : "",
                    }}
                  >
                    <a
                      className="dropdown-item"
                      style={{
                        color: selectedSubMenu === "AddRoom" ? "#fff" : "",
                      }}
                      onClick={() => {
                        handleSubMenuClick("AddRoom");
                        navigate("/admin/room/add_room");
                      }}
                    >
                      Add Room
                    </a>
                  </li>
                  <li
                    style={{
                      backgroundColor:
                        selectedSubMenu === "EditRoom"
                          ? "var(--color-secondary)"
                          : "",
                    }}
                  >
                    <a
                      className="dropdown-item"
                      style={{
                        color: selectedSubMenu === "EditRoom" ? "#fff" : "",
                      }}
                      onClick={() => {
                        handleSubMenuClick("EditRoom");
                        navigate("/admin/room/edit_room");
                      }}
                    >
                      Edit Room
                    </a>
                  </li>
                </ul>
              )}
            </li>
          )}
          <hr className="divider" />
          <li
            className="main-menu"
            style={{
              backgroundColor:
                selectedSubMenu === "Calendar" ? "var(--color-secondary)" : "",
            }}
          >
            <a
              className="routes"
              style={{
                color: selectedSubMenu === "Calendar" ? "#fff" : "",
              }}
              onClick={() => {
                handleSubMenuClick("Calendar");
                navigate("/admin/calendar");
              }}
            >
              <div className="routes-left">
                <FaRegCalendarAlt className="icon" />
                {!sidebarCollapsed && <span>Calendar</span>}
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
