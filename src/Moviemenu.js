import "./App.css";
import "./assets/css/font-awesome.css";
import "./assets/css/reset19.css";
import "./assets/css/slick.css";
import "./assets/css/style19.css";
import "./assets/css/swiper.css";
import poster01 from "./assets/img/poster01.jpg";
import poster02 from "./assets/img/poster02.jpg";
import poster03 from "./assets/img/poster03.jpg";
import poster04 from "./assets/img/poster04.jpg";
import poster05 from "./assets/img/poster05.jpg";
import poster06 from "./assets/img/poster06.jpg";
import poster07 from "./assets/img/poster07.jpg";
import poster08 from "./assets/img/poster08.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import Header from "./Header.js";

class MovieWrapper extends React.Component {
  constructor(props){
    super(props);
    this.handleMove = this.handleMove.bind(this);
    console.log(this.props.navigate);
  }

  /**
   * 
   * @param {React.MouseEvent} event 
   */
   handleMove = (event)=> {
    event.preventDefault();
    const {location, navigate} = this.props;

    var selectedMovie = event.currentTarget.parentElement.previousElementSibling.children[1].textContent;
    var state = location.state;
    state.movie = selectedMovie;

    if(event.target.textContent == "예매하기"){
      if (location.state.cinema) {
        navigate("/reservation-time", {
          state: state,
        });
      } else {
        navigate("/reservation-cinema", {
          state: state,
        });
      }
    }
    else if(event.target.textContent == "상세정보"){
      navigate("/movieInfo", {
        state: state
      })
    }
  }


  async componentDidMount(){
    console.log(this.props.location.state);
  }

  render() {
    const { state } = this.props.location;
    return (
      <div>
        <Header state={state}/>
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
                            <span class="icon a12 ir_pm">12세 이상 관람가</span>{" "}
                            <strong>스파이더맨: 노 웨이 홈</strong>
                          </h3>
                          <div class="infor_btn">
                            <a href="#:" onClick={this.handleMove}>상세정보</a>
                            <a href="#:" onClick={this.handleMove}>
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
                            <strong>돈 룩 업 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                          </h3>
                          <div class="infor_btn">
                            <a href="#:" onClick={this.handleMove}>상세정보</a>
                            <a href="#:" onClick={this.handleMove}>
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
                            <a href="#:" onClick={this.handleMove}>상세정보</a>
                            <a href="#:" onClick={this.handleMove}>
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
                            <a href="#:" onClick={this.handleMove}>상세정보</a>
                            <a href="#:" onClick={this.handleMove}>
                              예매하기
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="movie">
                <div class="movie_chart">
                  <div class="container2">
                    <div class="line2">
                      <div class="movie2">
                        <div class="poster">
                          <figure>
                            <img src={poster05} srcset={poster05} x2 alt="리슨" />
                          </figure>
                        </div>
                        <div class="infor">
                          <h3>
                            <span class="icon a12 ir_pm">12세 이상 관람</span>{" "}
                            <strong>리슨 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                          </h3>
                          <div class="infor_btn">
                            <a href="#:" onClick={this.handleMove}>상세정보</a>
                            <a href="#:" onClick={this.handleMove}>
                              예매하기
                            </a>
                          </div>
                        </div>
                      </div>
                      <div class="movie2">
                        <div class="poster">
                          <figure>
                            <img
                              src={poster06}
                              srcset={poster06}
                              x2
                              alt="유체이탈자"
                            />
                          </figure>
                        </div>
                        <div class="infor">
                          <h3>
                            <span class="icon a15 ir_pm">15세 이상 관람</span>{" "}
                            <strong>유체이탈자 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                          </h3>
                          <div class="infor_btn">
                            <a href="#:" onClick={this.handleMove}>상세정보</a>
                            <a href="#:" onClick={this.handleMove}>
                              예매하기
                            </a>
                          </div>
                        </div>
                      </div>
                      <div class="movie3">
                        <div class="poster">
                          <figure>
                            <img
                              src={poster07}
                              srcset={poster07}
                              x2
                              alt="연애 빠진 로맨스"
                            />
                          </figure>
                        </div>
                        <div class="infor">
                          <h3>
                            <span class="icon a15 ir_pm">15세 이상 관람</span>{" "}
                            <strong>연애 빠진 로맨스</strong>
                          </h3>
                          <div class="infor_btn">
                            <a href="#:" onClick={this.handleMove}>상세정보</a>
                            <a href="#:" onClick={this.handleMove}>
                              예매하기
                            </a>
                          </div>
                        </div>
                      </div>
                      <div class="movie4">
                        <div class="poster">
                          <figure>
                            <img
                              src={poster08}
                              srcset={poster08}
                              x2
                              alt="듄"
                            />
                          </figure>
                        </div>
                        <div class="infor">
                          <h3>
                            <span class="icon a12 ir_pm">12세 이상 관람</span>{" "}
                            <strong>듄 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                          </h3>
                          <div class="infor_btn">
                            <a href="#:" onClick={this.handleMove}>상세정보</a>
                            <a href="#:" onClick={this.handleMove}>
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

}

function list_movie() {
  const parameters = {
    query: "select * from student"
  };
  return fetch("http://localhost:3001/list_cinema",{
            method: "post", //통신방법
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parameters),
        })
        .then((res) => res.json())
        .then((res) => {
            console.log("res:" + res);
            console.log("res.status:" + res['status']);
            console.log("res.data: " + res['data']);
        })
        .catch((err) => {
          console.log(err);
        })
}

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    return (
      <Component
        navigate={navigate}
        location={location}
        {...props}
        />
    );
  };
  
  return Wrapper;
};

//export default Moviemenu;
export default withRouter(MovieWrapper);