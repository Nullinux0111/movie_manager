import "../../App.css";
import "../../assets/css/font-awesome.css";
import "../../assets/css/reset19.css";
import "../../assets/css/slick.css";
import "../../assets/css/style19.css";
import "../../assets/css/swiper.css";
import "../../assets/css/Reservation.css";
import pbl_logo from "../../assets/img/pbl_logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { Fragment } from "react";

class CinemaWrapper extends React.Component {

  state = {
    element:null
  }
  
  constructor(props) {
    super(props);
    this.handleMove = this.handleMove.bind(this);
    this.list_cinema = list_cinema.bind(this);
    console.log(this.props);
  }
  

handleMove = (event) => {
  event.preventDefault();
  if (this.props.location.state.movie !== false) {
    this.props.navigate("/reservation-time", {
      state: { cinema: "cinema", movie: this.props.location.state.movie },
    });
  } else {
    this.props.navigate("/Moviemenu", {
      state: { cinema: "cinema", movie: this.props.location.state.movie },
    });
  }
}

  async componentDidMount() {
    console.log(this.props.location.state);
    var element = await this.list_cinema();
    this.setState({ element });
  }

  render () { 
    const { element } = this.state;
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
                      {element}
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

function list_cinema() {
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
            var elements;
              if(res['status']){
                return (<Fragment>
                  {res['data'].map((data) => (
                    
                    <Link to={{pathname:"/Moviemenu",
                    state: {
                      movie: "movie"
                    }
                   }} class="cinema-link">
                    <div class="swiper-slide" onClick={this.handleMove}>
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
                            alt={data}
                          />
                        </figure>
                      </div>
                      <div class="infor">
                        <h3>
                          <strong>{data}</strong>
                        </h3>
                      </div>
                    </div>
                  </Link>
                    
                  ))}
                </Fragment>)
            }
            return undefined;
        })
        .catch((err) => {
            console.log(err);
        }); 
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

//export default Reservation;
export default withRouter(CinemaWrapper);