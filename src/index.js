import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import EMain from "./routes/employee/EMain";
import EInformation from "./routes/employee/EInformation";
import EComplain from "./routes/employee/EComplain";
import CMain from "./routes/customer/CMain";
import CInformation from "./routes/customer/CInformation";
import Movie from "./routes/customer/Movie";
import Reservation from "./routes/customer/Reservation";
import Complain from "./routes/customer/Complain";
import LoginPage from "./LoginPage";
import MovieInfo from "./MovieInfo";
import Main from "./Main";
import Moviemenu from "./Moviemenu";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} exact={true}/>
      <Route path="/employee" element={<EMain />} />
      <Route path="/employee/info" element={<EInformation />} />
      <Route path="/employee/complain" element={<EComplain />} />
      <Route path="/customer" element={<CMain />} />
      <Route path="/customer/info" element={<CInformation />} />
      <Route path="/movie" element={<Movie />} />
      <Route path="/reserv" element={<Reservation />} />
      <Route path="/complain" element={<Complain />} />
      <Route path="/movieinfo" element={<MovieInfo />} />
      <Route path="/Main" element={<Main />} />
      <Route path="/Moviemenu" element={<Moviemenu />} />
      <Route path="/LoginPage" element={<LoginPage />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
