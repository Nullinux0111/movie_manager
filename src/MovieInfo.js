import React, { useState } from "react";
import "./MovieInfo.css";
import { Link , useLocation} from 'react-router-dom';
import poster13a from './assets/img/poster13@2.jpg';
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

const menuList = {
    0: <MovSynopsis />,
    1: <MovStillcut />,
    2: <MovTrailer />,
    3: <MovRating />,
  };

const movieTitle = "듄";
const movieTitleOrig = "DUNE";
const age = "icon undera12";//상영등급. 백엔드 추출해서 나중에 써야지
const rate = 8.4; //예매율. 백엔드에서 추출
const soonwi = 2; //예매순위. 마찬가지로 백엔드에서 추출
const watchers = 1245345; //영화관 말고 영화진흥 위원회 기준! 어려우면 빼자
const genre = "SF"; //장르. 백엔드 추출??
const running_time = 155; //상영시간. 백엔드 추출
const is_on = false;

const director = "드니 빌뇌브"; //이것들은.. 따로 모아두는 페이지를 만들 게 아닌 이상 프론트엔드가 낫지않나
const actor = "티모시 샬라메 ,  레베카 퍼거슨 ,  오스카 아이삭 ,  제이슨 모모아 ,  조슈 브롤린 ,  젠데이아 콜먼 ,  하비에르 바르뎀 ,  스텔란 스카스가드 ,  장첸 ,  샤론 던컨 브루스터 ,  데이브 바티스타 ,  데이빗 다스트말치안";
const openingdate = "2021년 10월 20일";



class MovieInfo extends React.Component{

    constructor(props) {
        super();
    
        this.state = {
          menu: 0,
        };
      }

      changeMenu = (menuIndex) =>{
        this.setState({menu : menuIndex});
      }
    
      render(){

        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const name = params.get('name');

        console.log('name: ', name); // 테스트

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
                    <span class={age}></span>
 
                    <p class="movieName">

                    <strong class="movieTitle">
                        {movieTitle}
                    </strong>

                    <p class="movieTitleOrig">
                        {movieTitleOrig} 
                    </p>

                    <p class="movieSpec">예매율 <strong>{soonwi}</strong>위 ({rate}%) 누적 관객 수 <strong>{watchers}</strong>명 </p>

                    <p class="movieTMI">
                    
                    <p>감독 : {director} 장르 : {genre}/{running_time}분  개봉일: {openingdate} </p> 
                    <p>출연 {actor}  </p>
                    </p>

                    {is_on
                    ?<button className="resButton"> {/* 여기에만 parameter string을 받아서 링크로 보내면 되겠다!*/}
                        예매하기
                    </button>
                    :<button className='resButton_disabled'>
                        상영종료
                    </button>
                    }

                    </p>
                    </div>

                    <div class="mainPoster">
                    <img class="mainPosterImg" src={poster13a} alt="포스터" ></img> 
                    </div>

                    </div>

                    <div className="wrap">
                    <div className="menuBar">
                        <ul className="tabs">
                            <li className={`${this.state.menu === 0? 'active': ''}`} onClick={() => this.changeMenu(0)}>시놉시스</li>
                            {/*<li className={`${this.state.menu === 1? 'active': ''}`} onClick={() => this.changeMenu(1)}>스틸컷(실패)</li>*/}
                            <li className={`${this.state.menu === 2? 'active': ''}`} onClick={() => this.changeMenu(2)}>트레일러</li>
                            <li className={`${this.state.menu === 3? 'active': ''}`} onClick={() => this.changeMenu(3)}>평점</li>
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
      //const navigate = useNavigate();
      const location = useLocation();
      
      return (
        <Component
          //navigate={navigate}
          location={location}
          {...props}
          />
      );
    };
    
    return Wrapper;
  };

export default withRouter(MovieInfo);