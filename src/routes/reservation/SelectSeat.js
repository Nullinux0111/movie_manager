import "../../App.css";
import "../../assets/css/font-awesome.css";
import "../../assets/css/reset19.css";
import "../../assets/css/slick.css";
import "../../assets/css/style19.css";
import "../../assets/css/swiper.css";
import "../../assets/css/seat.css";
import Header from "../../Header.js";
import { Link, useNavigate, useLocation } from "react-router-dom";

function SelectSeat(props) {
  let navigate = useNavigate();
  let location = useLocation();
  let selectedSeats = new Array();
  console.log(location.state);
  for (let i = 0; i < 6; i++) {
    selectedSeats.push(new Array(10).fill(0));
  }

  function handleMove(event) {
    event.preventDefault();
    let reservSeats = new Array();
    for(let i =0; i<6; i++){
      for(let j=0; j<10; j++){
        if(selectedSeats[i][j] == 1) {
          reservSeats.push(String.fromCharCode(i+65) + String(j+1));
        }
      }
    }
    console.log(reservSeats);
    reserveRequest(reservSeats, location.state).then((result) => {

    })
  }

  function handleSelect(event) {
    event.preventDefault();
    event.target.classList.toggle("selected");
    for (let i = 1; i < 7; i++) {
      if (
        event.target.parentElement.parentElement.children[i] ==
        event.target.parentElement
      ) {
        for (let j = 0; j < 10; j++) {
          if (event.target == event.target.parentElement.children[j]) {
            if (selectedSeats[i - 1][j] == 0) {
              selectedSeats[i - 1][j] = 1;
            } else {
              selectedSeats[i - 1][j] = 0;
            }
            break;
          }
        }
      }
    }
  }

  function reserveRequest(seats, state){
    const parameters = {
      date: state.time,
      time: state.time,
      cinema: state.cinema,
      theater: state.theater,
      seat_num: seats,
      user: sessionStorage.getItem("MovieCurrentUser"),
    };
    console.log(parameters);
    if(!parameters.time|| !parameters.cinema || !parameters.theater){
      return Promise.resolve(false);
    }

    return fetch("http://localhost:3001/reservation", {
      method: "post", //통신방법
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parameters),
    })
    .then((res) => res.json())
    .then((res) => {
      console.log("res:" + res);
      console.log("res.status:" + res["status"]);
      console.log("res.data: " + res["data"]);
    })
    .catch((error)=>{
      console.log(error);
    })
  }

  return (
    <div>
      <Header />

      <section id="banner">
        <div class="slider">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide ss4">
                <div class="container">
                  <div class="row">
                    <h3>좌석 선택</h3>
                    <p>좌석을 선택해주세요</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="banner">
        <ul class="showcase">
          <li>
            <div class="seat"></div>
            <small>N/A</small>
          </li>
          <li>
            <div class="seat selected"></div>
            <small>Selected</small>
          </li>
          <li>
            <div class="seat occupied"></div>
            <small>Occupied</small>
          </li>
        </ul>

        <div class="container">
          <div class="screen"></div>

          <div class="row">
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
          </div>
          <div class="row">
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat occupied"></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat occupied"></div>
            <div class="seat occupied"></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
          </div>
          <div class="row">
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat occupied"></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat occupied"></div>
            <div class="seat occupied"></div>
          </div>
          <div class="row">
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat occupied"></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat occupied"></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat occupied"></div>
            <div class="seat" onClick={handleSelect}></div>
          </div>
          <div class="row">
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat occupied"></div>
            <div class="seat occupied"></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat occupied"></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
          </div>
          <div class="row">
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat" onClick={handleSelect}></div>
            <div class="seat occupied"></div>
            <div class="seat occupied"></div>
            <div class="seat occupied"></div>
            <div class="seat"></div>
          </div>
        </div>

        <div class="complete">
          <div class="complete-btn" onClick={handleMove}>
            예약 완료
          </div>
        </div>
      </section>

      <script src="./assets/js/jquery.min_1.12.4.js"></script>
      <script src="./assets/js/modernizr-custom.js"></script>
      <script src="./assets/js/ie-checker.js"></script>
      <script src="./assets/js/swiper.min.js"></script>
      <script src="./assets/js/iframe_api.js"></script>
      <script src="./assets/js/movie.js"></script>
    </div>
  );
}

export default SelectSeat;
