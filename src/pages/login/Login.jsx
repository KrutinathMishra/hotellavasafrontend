import { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import "./Login.css";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;

    try {
      const { data } = await axios.post("/user/login", {
        email,
        password,
      });

      if (data.accesstoken) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accesstoken}`;
        localStorage.setItem("firstLogin", true);
      } else {
      }
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Login Successful. Welcome");
        navigate("/admin");
      }
    } catch (err) {
      const errorResponse = err.response?.data?.msg || "An error occurred";
      console.error("Error during login:", err);
    }
  };

  return (
    <div className="container">
      <div className="login-tile">
        <h1>Login</h1>
        <div className="form-container">
          <form className="form" onSubmit={loginUser}>
            <input
              type="email"
              placeholder="EMAIL"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="PASSWORD"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <button type="submit" className="opacity">
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
