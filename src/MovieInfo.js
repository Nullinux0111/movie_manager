import React, { useState } from "react";
import "./MovieInfo.css";
import { Link , useLocation, useNavigate} from 'react-router-dom';
import poster13a from './assets/img/poster13@2.jpg';
import poster8 from "./assets/img/20210087/poster.jpg";
import Header from "./Header.js";
import './assets/css/style19.css';
import './assets/css/slick.css';
import './assets/css/reset19.css';
import './assets/css/font-awesome.css';
import './assets/css/swiper.css';
import MovSynopsis from './assets/js/MovieSynopsis';
import MovStillcut from './assets/js/MovieStillcut';
import MovTrailer from './assets/js/MovieTrailer';
import MovRating from './assets/js/MovieRating';

var movieTitleOrig = "DUNE";
var rate = 8.4; //예매율. 백엔드에서 추출
var soonwi = 2; //예매순위. 마찬가지로 백엔드에서 추출
var watchers = 1245345; //영화관 말고 영화진흥 위원회 기준! 어려우면 빼자
var is_on = false;

var openingdate = "2021년 10월 20일";

function grade(age){
  if(age === "전체이용가"){
    return "icon underall"
  }
  else if(age === "12세이상관람가"){
    return "icon undera12"
  }
  else if(age === "15세이상관람가"){
    return "icon undera15"
  }
  else if(age === "청소년관람불가"){
    return "icon undera18"
  }
  return "nah"
}

class MovieInfo extends React.Component{

    constructor(props) {
        super();
    
        this.state = {
          movie_id: 0,
          menu: 0,
          loading: false,
          isloading: false,
          movieTitle: "",
          movieTitleOrig: "",
          age: "",
          rate: 0.0,
          soonwi: 0,
          running_time: 0,
          is_on: false,
          director: "",
          actor: "",
          openingdate: "",
          synopsis: "",
          image: require('./assets/img/poster13@2.jpg')
        };
      }

      changeMenu = (menuIndex) =>{
        this.setState({menu : menuIndex});
      }

      setLoading = (value) =>{
        this.setState({loading : value});
      }

      setIsLoading = (value) =>{
        this.setState({isloading : value});
      }

      componentDidMount() {
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const name = params.get('name');

        this.setState({
          image:require("./assets/img/"+name+"/poster.jpg").default
        });

        console.log('name: ', name); // 테스트
        
          console.log("load informations...");
          this.setLoading(true);
          const parameters = {
              movie_id: name
          };
          console.log(JSON.stringify(parameters));
          fetch("http://localhost:3001/getMovieInfo",{
              method: "post", //통신방법
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(parameters),
          })
          .then((res) => res.json())
          .then((res) => {
              console.log("res:" + res);
              console.log("res.data: " + res['data']);
              //setText(parameters['id']);
              
              this.setState({movie_id: res['data'][0]});
              this.setState({movieTitle: res['data'][1]});
              this.setState({director: res['data'][2]});
              this.setState({actor: res['data'][3].toString()});

              this.setState({age: res['data'][4]});

              this.setState({genre: res['data'][5]});
              this.setState({running_time: res['data'][6]});
              this.setState({synopsis: res['data'][7]});
              this.setState({is_on: res['data'][8]});

              //setPhone(res['data'][2]);
              //setBDay(res['data'][3].substr(0,10));
  
              this.setLoading(false);
              this.setIsLoading(false);
          })
          .catch((err) => {
              console.log(err);
              this.setLoading(false);
              this.setIsLoading(false);
          });
      }
    
      render(){

      const menuList = {
        0: <MovSynopsis cont = {this.state.movie_id} />,
        1: <MovStillcut />,
        2: <MovTrailer cont = {this.state.movie_id}/>,
        3: <MovRating />,
      };

    return(
      
    <html>

    <body className="MovieInfoPage">
    <Header state={this.props.location.state}/>

    <section id="movieinfo">
        <div class="container">
            <div class="row">
                <div class="movieDetail">
                    <div class="movieBrief">
                        
                    <div class="moviePart">
                    <span class={grade(this.state.age)}></span>
 
                    <p class="movieName">

                    <strong class="movieTitle">
                        {this.state.movieTitle}
                    </strong>

                    <p class="movieTitleOrig">
                      .
                        {/* {movieTitleOrig} */}
                    </p>

                    <p class="movieSpec"> . </p>
                    {/*<p class="movieSpec">예매율 <strong>{soonwi}</strong>위 ({rate}%) 누적 관객 수 <strong>{watchers}</strong>명 </p>*/}

                    <p class="movieTMI">
                    
                    <p>감독 : {this.state.director} 장르 : {this.state.genre}/{this.state.running_time}분 </p> {/*개봉일: {openingdate}*/}
                    <p>출연 : {this.state.actor}  </p>
                    </p>

                    {this.state.is_on !=="모든영화가 상영중 혹은 상영예정이다"
                    ?<button className="resButton" onclick={() => this.props.navigate("/reservation-cinema", {
                      state: {
                        cinema: false,
                        movie: this.state.movieTitle
                      },
                    })}> {/* 여기에만 parameter string을 받아서 링크로 보내면 되겠다!*/}
                        예매하기
                    </button>
                    :<button className='resButton_disabled'>
                        상영종료
                    </button>
                    }

                    </p>
                    </div>

                    <div class="mainPoster">
                    <img class="mainPosterImg" src={this.state.image} alt="포스터" ></img> 
                    </div>

                    </div>

                    <div className="wrap">
                    <div className="menuBar">
                        <ul className="tabs">
                            <li className={`${this.state.menu === 0? 'active': ''}`} onClick={() => this.changeMenu(0)}>시놉시스</li>
                            {/*<li className={`${this.state.menu === 1? 'active': ''}`} onClick={() => this.changeMenu(1)}>스틸컷(실패)</li>*/}
                            <li className={`${this.state.menu === 2? 'active': ''}`} onClick={() => this.changeMenu(2)}>트레일러</li>
                            {/*<li className={`${this.state.menu === 3? 'active': ''}`} onClick={() => this.changeMenu(3)}>평점</li>*/}
                        </ul>
                        </div>
                     <div className="contentArea">
                        {menuList[this.state.menu]}
                     </div>
                     </div>
                    
                </div>

            </div>
        </div>
    </section>

    </body>
    </html>
    )
    }

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

export default withRouter(MovieInfo);