import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import EMain from "./routes/employee/EMain";
import EInformation from "./routes/employee/EInformation";
import EComplain from "./routes/employee/EComplain";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/employee" element={<EMain />} />
      <Route path="/employee/info" element={<EInformation />} />
      <Route path="/employee/complain" element={<EComplain />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
