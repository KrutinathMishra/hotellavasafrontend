import React, { useState, useContext } from "react";
import "./Home.css";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";
import Pages from "./Pages";
import { GlobalState } from "../GlobalState";

const Home = () => {
  const state = useContext(GlobalState);
  const [sidebarCollapsed, setSidebarCollapsed] = state.sidebarCollapsed;
  return (
    <div className={sidebarCollapsed ? "home-collapsed" : "home"}>
      <div
        className={
          sidebarCollapsed
            ? "main-sidebar-container-collapsed"
            : "main-sidebar-container"
        }
      >
        <Sidebar />
      </div>
      <div
        className={
          sidebarCollapsed
            ? "main-nav-page-container-collapsed"
            : "main-nav-page-container"
        }
      >
        <div className="main-navbar-container">
          <Navbar />
        </div>
        <div className="main-pages-container">
          <Pages />
        </div>
      </div>
    </div>
  );
};

export default Home;
