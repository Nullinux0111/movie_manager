import "./App.css";
import "./assets/css/font-awesome.css";
import "./assets/css/reset19.css";
import "./assets/css/slick.css";
import "./assets/css/style19.css";
import "./assets/css/swiper.css";
import Header from "./Header.js";
import poster01 from "./assets/img/poster01.jpg";
import poster02 from "./assets/img/poster02.jpg";
import poster03 from "./assets/img/poster03.jpg";
import poster04 from "./assets/img/poster04.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Main() {
  let navigate = useNavigate();
  let location = useLocation();

  function moveInfo(event) {
    event.preventDefault();
    navigate("/movieInfo");
    window.location.reload();
  }

  /**
   *
   * @param {React.MouseEvent} event
   */
  function handleMove(event) {
    event.preventDefault();
    navigate("/reservation-cinema", {
      state: {
        cinema: false,
        movie:
          event.currentTarget.parentElement.previousElementSibling.children[1]
            .textContent,
      },
    });
  }

  return (
    <div>
      <Header state={location.state} />
      <section id="banner">
        <div class="banner_menu">
          <h2 class="ir_so">배너 영역</h2>
          <div class="container">
            <div class="row">
              <div class="bm_right">
                {/* <ul>
                  <li class="white">
                    <a href="#:">상영시간표</a>
                  </li>
                  <li class="purple">
                    <a href="#:">빠른예매</a>
                  </li>
                </ul> */}
              </div>
            </div>
          </div>
        </div>
        <div class="slider">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide ss1">
                <div class="container">
                  <div class="row">
                    <h3>스파이더맨: 노 웨이 홈</h3>
                    <p>개봉전 예매율 1위</p>
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
            <div class="movie">
              <div class="movie_chart">
                <div class="container1">
                  <div class="line1">
                    <div class="movie1">
                      <div class="poster">
                        <figure>
                          <img src={poster01} srcset={poster01} x2 alt="스파이더맨 : 노 웨이 홈" />
                        </figure>
                      </div>
                      <div class="infor">
                        <h3>
                          <span class="icon a12 ir_pm">12세 이상 관람</span>{" "}
                          <strong>스파이더맨: 노 웨이 홈</strong>
                        </h3>
                        <div class="infor_btn">
                          <a href="#:" onClick={moveInfo}>
                            상세정보
                          </a>
                          <a href="#:" onClick={handleMove}>
                            예매하기
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="movie2">
                      <div class="poster">
                        <figure>
                          <img
                            src={poster02}
                            srcset={poster02}
                            x2
                            alt="돈 룩 업"
                          />
                        </figure>
                      </div>
                      <div class="infor">
                        <h3>
                          <span class="icon a15 ir_pm">15세 이상 관람</span>{" "}
                          <strong>돈 룩 업 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                        </h3>
                        <div class="infor_btn">
                          <a href="#:" onClick={moveInfo}>
                            상세정보
                          </a>
                          <a href="#:" onClick={handleMove}>
                            예매하기
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="movie3">
                      <div class="poster">
                        <figure>
                          <img
                            src={poster03}
                            srcset={poster03}
                            x2
                            alt="소설가 구보의 하루"
                          />
                        </figure>
                      </div>
                      <div class="infor">
                        <h3>
                          <span class="icon a12 ir_pm">12세 이상 관람</span>{" "}
                          <strong>소설가 구보의 하루</strong>
                        </h3>
                        <div class="infor_btn">
                          <a href="#:" onClick={moveInfo}>
                            상세정보
                          </a>
                          <a href="#:" onClick={handleMove}>
                            예매하기
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="movie4">
                      <div class="poster">
                        <figure>
                          <img
                            src={poster04}
                            srcset={poster04}
                            x2
                            alt="왼팔의복서 닉"
                          />
                        </figure>
                      </div>
                      <div class="infor">
                        <h3>
                          <span class="icon a15 ir_pm">15세 이상 관람</span>{" "}
                          <strong>왼팔의복서 닉 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                        </h3>
                        <div class="infor_btn">
                          <a href="#:" onClick={moveInfo}>
                            상세정보
                          </a>
                          <a href="#:" onClick={handleMove}>
                            예매하기
                          </a>
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

export default Main;
