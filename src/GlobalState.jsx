import { createContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import UserAPI from "./api/UserAPI";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const refreshToken = async () => {
    const res = await axios.get("/user/refresh_token");
    if (res.data.error) {
      localStorage.clear();
    } else {
      setToken(res.data.accesstoken);
    }
  };

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) refreshToken();
  }, []);

  const state = {
    sidebarCollapsed: [sidebarCollapsed, setSidebarCollapsed],
    token: [token, setToken],
    userAPI: UserAPI(token),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
