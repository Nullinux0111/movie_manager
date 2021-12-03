import "../../App.css";
import "../../assets/css/font-awesome.css";
import "../../assets/css/reset19.css";
import "../../assets/css/slick.css";
import "../../assets/css/style19.css";
import "../../assets/css/swiper.css";
import "../../assets/css/movieInfo.css";
import poster01 from "../../assets/img/poster01.jpg";
import poster02 from "../../assets/img/poster02.jpg";
import poster03 from "../../assets/img/poster03.jpg";
import poster04 from "../../assets/img/poster04.jpg";
import pbl_logo from "../../assets/img/pbl_logo.png";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

function MovieInfo() {
  let navigate = useNavigate();

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

      <section id="movie">
        <div class="container">
          <div class="row">
            <div class="movie">
              <div class="movie_info_chart">
                <div class="container1">
                  <div class="line1">
                    <div class="movie-info1">
                      <div class="poster">
                        <figure>
                          <img src={poster01} srcset={poster01} x2 alt="침묵" />
                        </figure>
                      </div>
                      <div class="infor">
                        <div>
                          <h3>
                            <span class="infor-title">침묵</span>
                          </h3>
                        </div>
                        <div>
                          <h4>
                            <span class="infor-content">감독: </span>
                          </h4>
                        </div>
                        <div>
                          <h4>
                            <span class="infor-content">배우: </span>
                          </h4>
                        </div>
                        <div>
                          <h4>
                            <span class="infor-content">심의등급: </span>
                          </h4>
                        </div>
                        <div>
                          <h4>
                            <span class="infor-content">장르: </span>
                          </h4>
                        </div>
                        <div>
                          <h4>
                            <span class="infor-content">상영시간: </span>
                          </h4>
                        </div>
                        <div>
                          <h5>
                            <span class="infor-content">시놉시스: </span>
                          </h5>
                        </div>
                      </div>
                    </div>
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

export default MovieInfo;
