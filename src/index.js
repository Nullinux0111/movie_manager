import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App";
import LoginPage from ".//LoginPage";
import Main from "./Main";
import MyPage from "./Mypage";
import SignUpPage from "./SignUpPage";
import MovieWrapper from "./Moviemenu";
import CinemaWrapper from "./routes/reservation/Reservation";
import SelectTime from "./routes/reservation/SelectTime";
import ReservationComplete from "./routes/reservation/ResComplete";
import SelectSeat from "./routes/reservation/SelectSeat";
import MovieInfo from "./MovieInfo";
import StaffCeo from "./StaffCeo";
import ScrollTop from "./ScrollTop";
import LoginPageEmployee from "./LoginPageEmployee";

ReactDOM.render(
  <BrowserRouter>
  <ScrollTop />
    <Routes>
      <Route path="/" element={<App />} exact={true} />
      <Route path="/Main" element={<Main />} />
      <Route path="/Moviemenu" element={<MovieWrapper />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/SignUpPage" element={<SignUpPage />} />
      <Route path="/MyPage" element={<MyPage />} />
      <Route path="/reservation-cinema" element={<CinemaWrapper />} />
      <Route path="/reservation-time" element={<SelectTime />} />
      <Route path="/reservation-complete" element={<ReservationComplete />} />
      <Route path="/movieInfo" element={<MovieInfo />} />
      <Route path="/StaffCeo" element={<StaffCeo />} />
      <Route path="/reservation-seat" element={<SelectSeat />} />
      <Route path="/LoginPageEmployee" element={<LoginPageEmployee/>} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
