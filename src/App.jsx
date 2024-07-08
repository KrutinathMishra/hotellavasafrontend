import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/Home";
import { AuthorizeUser, ProtectRoute } from "../src/api/Auth";

import axios from "axios";
import { Toaster } from "react-hot-toast";

import "./App.css";

axios.defaults.baseURL = "https://hotellavasabackend.onrender.com/admin";
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <Router>
      <Toaster position="bottom-right" toastOptions={{ duration: 8000 }} />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <AuthorizeUser>
              <Home />
            </AuthorizeUser>
          }
        />

        <Route path="/admin/login" element={<Login />} />
      </Routes>
    </Router>
  );
};
export default App;
