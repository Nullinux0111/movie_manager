import "../../App.css";
import "../../assets/css/font-awesome.css";
import "../../assets/css/reset19.css";
import "../../assets/css/slick.css";
import "../../assets/css/style19.css";
import "../../assets/css/swiper.css";
import "../../assets/css/Reservation.css";
import pbl_logo from "../../assets/img/pbl_logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";

function Reservation() {
  let location = useLocation();
  let navigate = useNavigate();
  console.log(location.state);

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
    if (location.state.movie !== false) {
      navigate("/reservation-time", {
        state: { cinema: "cinema", movie: location.state.movie },
      });
    } else {
      navigate("/Moviemenu", {
        state: { cinema: "cinema", movie: location.state.movie },
      });
    }
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

      <section id="banner">
        <div class="slider">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide ss4">
                <div class="container">
                  <div class="row">
                    <h3>영화관 선택</h3>
                    <p>영화관을 선택해주세요</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="movie">
        <div class="container">
          <div class="row">
            <h2 class="ir_so">영화 예매</h2>
            <div class="movie">
              <div class="movie_chart">
                <div class="swiper-container2">
                  <div class="chart_cont1 swiper-wrapper">
                    <Link to="/Moviemenu" class="cinema-link">
                      <div class="swiper-slide" onClick={handleMove}>
                        <div class="poster">
                          <figure>
                            <img
                              src={
                                "https://newsimg.sedaily.com/2020/02/25/1YZ25GP7B6_1.jpg"
                              }
                              srcset={
                                "https://newsimg.sedaily.com/2020/02/25/1YZ25GP7B6_1.jpg"
                              }
                              x2
                              alt="영화관1"
                            />
                          </figure>
                        </div>
                        <div class="infor">
                          <h3>
                            <strong>영화관 1</strong>
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <Link to="/Moviemenu" class="cinema-link">
                      <div class="swiper-slide" onClick={handleMove}>
                        <div class="poster">
                          <figure>
                            <img
                              src={
                                "https://newsimg.sedaily.com/2020/02/25/1YZ25GP7B6_1.jpg"
                              }
                              srcset={
                                "https://newsimg.sedaily.com/2020/02/25/1YZ25GP7B6_1.jpg"
                              }
                              x2
                              alt="영화관2"
                            />
                          </figure>
                        </div>
                        <div class="infor">
                          <h3>
                            <strong>영화관 2</strong>
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <Link to="/Moviemenu" class="cinema-link">
                      <div class="swiper-slide"  onClick={handleMove}>
                        <div class="poster">
                          <figure>
                            <img
                              src={
                                "https://newsimg.sedaily.com/2020/02/25/1YZ25GP7B6_1.jpg"
                              }
                              srcset={
                                "https://newsimg.sedaily.com/2020/02/25/1YZ25GP7B6_1.jpg"
                              }
                              x2
                              alt="영화관3"
                            />
                          </figure>
                        </div>
                        <div class="infor">
                          <h3>
                            <strong>영화관 3</strong>
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <Link to="/Moviemenu" class="cinema-link">
                      <div class="swiper-slide"  onClick={handleMove}>
                        <div class="poster">
                          <figure>
                            <img
                              src={
                                "https://newsimg.sedaily.com/2020/02/25/1YZ25GP7B6_1.jpg"
                              }
                              srcset={
                                "https://newsimg.sedaily.com/2020/02/25/1YZ25GP7B6_1.jpg"
                              }
                              x2
                              alt="영화관4"
                            />
                          </figure>
                        </div>
                        <div class="infor">
                          <h3>
                            <strong>영화관 4</strong>
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

export default Reservation;
