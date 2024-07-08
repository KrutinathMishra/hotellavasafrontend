import React from "react";
import ReactDOM from "react-dom/client";

import { DataProvider } from "./GlobalState";

import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DataProvider>
    <App />
  </DataProvider>
);
