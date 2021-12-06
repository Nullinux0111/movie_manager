import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import LoginPage from ".//LoginPage";
import Main from "./Main";
import MovieWrapper from "./Moviemenu";
import CinemaWrapper from "./routes/reservation/Reservation";
import SelectTime from "./routes/reservation/SelectTime";
import ReservationComplete from "./routes/reservation/ResComplete";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} exact={true} />
      <Route path="/Main" element={<Main />} />
      <Route path="/Moviemenu" element={<MovieWrapper />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/reservation-cinema" element={<CinemaWrapper />} />
      <Route path="/reservation-time" element={<SelectTime />} />
      <Route path="/reservation-complete" element={<ReservationComplete />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
