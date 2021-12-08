import "../../App.css";
import "../../assets/css/font-awesome.css";
import "../../assets/css/reset19.css";
import "../../assets/css/slick.css";
import "../../assets/css/style19.css";
import "../../assets/css/swiper.css";
import "../../assets/css/Reservation-time.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "../../Header.js";
import React, { Fragment } from "react";

class SelectTime extends React.Component {
  state = {
    element: null,
  };

  constructor(props) {
    super(props);
    this.handleMove = this.handleMove.bind(this);
    this.list_schedule = list_schedule.bind(this);
    console.log(this.props);
  }

  handleMove = (event) => {
    event.preventDefault();
    const { location, navigate } = this.props;

    var selectedTime = event.currentTarget.children[1].textContent;
    var state = location.state;
    state.time = selectedTime;

    navigate("/reservation-seat", { state: state });
  };

  async componentDidMount() {
    console.log(this.props.location.state);
    var element = await this.list_schedule(
      this.props.location.state.cinema,
      this.props.location.state.movie
    );
    this.setState({ element });
  }

  render() {
    const { element } = this.state;
    const { state } = this.props.location;
    return (
      <div>
        <Header state={state} />

        <section id="banner">
          <div class="slider">
            <div class="swiper-container">
              <div class="swiper-wrapper">
                <div class="swiper-slide ss4">
                  <div class="container">
                    <div class="row">
                      <h3>시간 선택</h3>
                      <p>관람하실 시간을 선택해주세요</p>
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
                  <div class="swiper-container2">
                    <div class="chart_cont1 swiper-wrapper">{element}</div>
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

function list_schedule(cinema, movie) {
  const parameters = {
    cinema: '안산',
    filter: { movie_name: '안녕' },
  };
  return fetch("http://localhost:3001/list_schedule", {
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
      var elements;
      if (res["status"]) {
        return (
          <Fragment>
            {res["data"].map((data) => (
              <Link to="/reservation-seat" class="cinema-link">
                <div class="swiper-slide">
                  <div class="infor">
                    <h3>
                      <strong>{refactory(data[1])}</strong>
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </Fragment>
        );
      }
      return undefined;
    })
    .catch((err) => {
      console.log(err);
    });
}

function refactory(date) {
  const moment = require('moment');
	
	return moment(date).format('YYYY-MM-DD HH:mm');
}

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate();
    const location = useLocation();

    return <Component navigate={navigate} location={location} {...props} />;
  };

  return Wrapper;
};

export default withRouter(SelectTime);
