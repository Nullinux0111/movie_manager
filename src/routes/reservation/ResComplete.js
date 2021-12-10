import "../../App.css";
import "../../assets/css/font-awesome.css";
import "../../assets/css/reset19.css";
import "../../assets/css/slick.css";
import "../../assets/css/style19.css";
import "../../assets/css/swiper.css";
import pbl_logo from "../../assets/img/pbl_logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "../../Header.js";

function ReservationComplete(props) {
  let navigate = useNavigate();
  let location = useLocation();

  function moveMovie(event) {
    event.preventDefault();
    navigate("/Moviemenu", { state: { cinema: false, movie: false } });
  }

  function moveCinema(event) {
    event.preventDefault();
    navigate("/reservation-cinema", { state: { cinema: false, movie: false } });
  }
  
  return (
    <div>
      <Header state={location.state}/>

      <section id="banner">
        <div class="banner_menu">
          <h2 class="ir_so">배너 영역</h2>
          <div class="container">
            <div class="row">
              <div class="bm_right">
                <ul>
                  <Link to="/Main">
                    <li class="purple">
                      <a href="#:">메인 메뉴</a>
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="slider">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide ss2">
                <div class="container">
                  <div class="row">
                    <h3>예매 완료</h3>
                    <p>이용해 주셔서 감사합니다.</p>
                  </div>
                </div>
              </div>
            </div>
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

export default ReservationComplete;
