import "../../App.css";
import "../../assets/css/font-awesome.css";
import "../../assets/css/reset19.css";
import "../../assets/css/slick.css";
import "../../assets/css/style19.css";
import "../../assets/css/swiper.css";
import "../../assets/css/Reservation-time.css";
import pbl_logo from "../../assets/img/pbl_logo.png";
import { Link } from "react-router-dom";

function SelectTime() {
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
              <nav id="mNav">
                <h2 class="ir_so">전체메뉴</h2>
                <a href="#:" class="ham">
                  <span></span>
                </a>
              </nav>
              <nav class="nav">
                <ul class="clearfix">
                  <Link to="/Moviemenu">
                    <li>
                      <a href="#:">영화</a>
                    </li>
                  </Link>
                  <li>
                    <a href="#:">영화관</a>
                  </li>
                  <li>
                    <a href="#:">스토어</a>
                  </li>
                  <li>
                    <a href="#:">고객센터</a>
                  </li>
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

      <section id="movie">
        <div class="container">
          <div class="row">
            <div class="movie">
              <div class="movie_chart">
                <div class="swiper-container2">
                  <div class="chart_cont1 swiper-wrapper">
                    <Link to="/reservation-complete" class="cinema-link">
                      <div class="swiper-slide">
                        <div class="infor">
                          <h3>
                            <strong>시간 1</strong>
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <Link to="#" class="cinema-link">
                      <div class="swiper-slide">
                        <div class="infor">
                          <h3>
                            <strong>시간 2</strong>
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <Link to="#" class="cinema-link">
                      <div class="swiper-slide">
                        <div class="infor">
                          <h3>
                            <strong>시간 3</strong>
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <Link to="#" class="cinema-link">
                      <div class="swiper-slide">
                        <div class="infor">
                          <h3>
                            <strong>시간 4</strong>
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div class="swiper-container2">
                  <div class="chart_cont1 swiper-wrapper">
                    <Link to="#" class="cinema-link">
                      <div class="swiper-slide">
                        <div class="infor">
                          <h3>
                            <strong>시간 1</strong>
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <Link to="#" class="cinema-link">
                      <div class="swiper-slide">
                        <div class="infor">
                          <h3>
                            <strong>시간 2</strong>
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <Link to="#" class="cinema-link">
                      <div class="swiper-slide">
                        <div class="infor">
                          <h3>
                            <strong>시간 3</strong>
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <Link to="#" class="cinema-link">
                      <div class="swiper-slide">
                        <div class="infor">
                          <h3>
                            <strong>시간 4</strong>
                          </h3>
                        </div>
                      </div>
                    </Link>
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

export default SelectTime;
