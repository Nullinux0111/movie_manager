import "./App.css";
import "./assets/css/font-awesome.css";
import "./assets/css/reset19.css";
import "./assets/css/slick.css";
import "./assets/css/style19.css";
import "./assets/css/swiper.css";
import pbl_logo from "./assets/img/pbl_logo.png";
import poster01 from "./assets/img/poster01.jpg";
import poster02 from "./assets/img/poster02.jpg";
import poster03 from "./assets/img/poster03.jpg";
import poster04 from "./assets/img/poster04.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";


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
    console.log(event.target.id);
    const {location, navigate} = this.props;

    if(event.target.id == '2'){
      if (location.state.cinema !== false) {
        this.navaigate("/reservation-time", {
          state: { cinema: location.state.cinema, movie: event.currentTarget.previousElementSibling.children[1].textContent },
        });
      } else {
        
        this.navigate("/reservation-cinema", {
          state: { cinema: location.state.cinema, movie: event.currentTarget.previousElementSibling.children[1].textContent },
        });
      }
    }
    
  }


  async componentDidMount(){
    console.log(this.props.location.state);
    //var element = await this.list_movie();
    //this.setState({ element });
  }

  render() {
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
                    <li>
                      <a href="#:">영화</a>
                    </li>
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
                  <div class="container1">
                    <div class="line1">
                      <div class="movie1">
                        <div class="poster">
                          <figure>
                            <img src={poster01} srcset={poster01} x2 alt="침묵" />
                          </figure>
                        </div>
                        <div class="infor">
                          <h3>
                            <span class="icon all ir_pm">전체관람가</span>{" "}
                            <strong>침묵</strong>
                          </h3>
                          <div class="infor_btn" onClick={this.handleMove}>
                            <a id='1' href="#:">상세정보</a>
                            <a id='2' href="#:">
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
                              alt="신세계"
                            />
                          </figure>
                        </div>
                        <div class="infor">
                          <h3>
                            <span class="icon a19 ir_pm">19세 이상 관람</span>{" "}
                            <strong>신세계</strong>
                          </h3>
                          <div class="infor_btn">
                            <a href="#:">상세정보</a>
                            <a href="#:">예매하기</a>
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
                              alt="마스터"
                            />
                          </figure>
                        </div>
                        <div class="infor">
                          <h3>
                            <span class="icon a12 ir_pm">12세 이상 관람</span>{" "}
                            <strong>마스터</strong>
                          </h3>
                          <div class="infor_btn">
                            <a href="#:">상세정보</a>
                            <a href="#:">예매하기</a>
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
                              alt="마약왕"
                            />
                          </figure>
                        </div>
                        <div class="infor">
                          <h3>
                            <span class="icon a15 ir_pm">15세 이상 관람</span>{" "}
                            <strong>마약왕</strong>
                          </h3>
                          <div class="infor_btn">
                            <a href="#:">상세정보</a>
                            <a href="#:">예매하기</a>
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