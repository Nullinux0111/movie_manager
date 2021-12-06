import "../../App.css";
import "../../assets/css/font-awesome.css";
import "../../assets/css/reset19.css";
import "../../assets/css/slick.css";
import "../../assets/css/style19.css";
import "../../assets/css/swiper.css";
import "../../assets/css/seat.css";
import pbl_logo from "../../assets/img/pbl_logo.png";
import { Link, useNavigate } from "react-router-dom";

function SelectSeat() {
  let navigate = useNavigate();

  function moveMovie(event) {
    event.preventDefault();
    navigate("/Moviemenu", { state: { cinema: false, movie: false } });
  }

  function moveCinema(event) {
    event.preventDefault();
    navigate("/reservation-cinema", { state: { cinema: false, movie: false } });
  }

  function handleMove(event) {
    event.preventDefault();
    navigate("/reservation-complete");
  }

  function handleSelect(event) {
    event.preventDefault();
    event.target.classList.toggle("selected");
  }

  return (
    <div>
      <header id="header">
        <div class="container">
          <div class="row">
            <div class="header clearfix">
              <h1>
                <Link to="/Main">
                  <em>
                    <img src={pbl_logo} alt="일석이조" />
                  </em>
                </Link>
              </h1>
              {/* <nav id="mNav">
                <h2 class="ir_so">전체메뉴</h2>
                <a href="#:" class="ham">
                  <span></span>
                </a>
              </nav> */}
              <nav class="nav">
                <ul class="clearfix">
                  <Link to="/Moviemenu">
                    <li onClick={moveMovie}>
                      <a href="#:">영화</a>
                    </li>
                  </Link>
                  <Link to="/reservation-cinema">
                    <li onClick={moveCinema}>
                      <a href="#:">영화관</a>
                    </li>
                  </Link>
                  <li>
                    <a href="#:">스토어</a>
                  </li>
                  <Link to="/StaffCeo">
                    <li>
                      <a href="#:">고객센터</a>
                    </li>
                  </Link>
                  <Link to="/LoginPage">
                    <li>
                      <a href="#:">로그인</a>
                    </li>
                  </Link>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

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
