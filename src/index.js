import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import LoginPage from ".//LoginPage";
import Main from "./Main";
import Moviemenu from "./Moviemenu";
import MyPage from "./Mypage";
import Reservation from "./routes/reservation/Reservation";
import SelectTime from "./routes/reservation/SelectTime";
import ReservationComplete from "./routes/reservation/ResComplete";
import MovieInfo from "./MovieInfo";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} exact={true} />
      <Route path="/Main" element={<Main />} />
      <Route path="/Moviemenu" element={<Moviemenu />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/MyPage" element={<MyPage />} />
      <Route path="/reservation-cinema" element={<Reservation />} />
      <Route path="/reservation-time" element={<SelectTime />} />
      <Route path="/reservation-complete" element={<ReservationComplete />} />
      <Route path="/movieInfo" element={<MovieInfo />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
