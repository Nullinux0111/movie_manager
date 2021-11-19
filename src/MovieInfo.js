import React from "react";
import "./MovieInfo.css";
import { Link } from 'react-router-dom';
import pbl_logo from './assets/img/pbl_logo.png';
import poster01 from './assets/img/poster01.jpg';
import poster02 from './assets/img/poster02.jpg';
import poster03 from './assets/img/poster03.jpg';
import poster04 from './assets/img/poster04.jpg';

function MovieInfo() {
    return(
    <html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
        <link rel="shortcut icon" href="/static/pc/images/favicon.ico" />
    
            <title>MEET PLAY SHARE, 메가박스</title>
            <meta property="name"			id="metaTagTitle"	content="[메가박스]듄"/>
            <meta property="description"	id="metaTagDtls"	content="“듄을 지배하는 자가 우주를 지배한다!”10191년, 아트레이데스 가문의 후계자인 폴(티모시 샬라메)은 시공을 초월한 존재이자 전 우주를 구원할 예지된 자의 운명을 타고났다. 그리고 어떤 계시처럼 매일 꿈에서 아라키스 행성에 있는 한 여인을 만난다. 모래언덕을 뜻하는 '듄'이라 불리는 아라키스는 물 한 방울 없는 사막이지만 우주에서 가장 비싼 물질인 신성한 환각제 스파이스의 유일한 생산지로 이를 차지하기 위한 전쟁이 치열하다. 황제의 명령으로 폴과 아트레이데스 가문은 죽음이 기다리는 아라키스로 향하는데…위대한 자는 부름에 응답한다, 두려움에 맞서라, 이것은 위대한 시작이다!"/>
            <meta property="keywords"		id="metaTagKeyword"	content="듄,DUNE,SF,티모시 샬라메, 레베카 퍼거슨, 오스카 아이삭, 제이슨 모모아, 조슈 브롤린, 젠데이아 콜먼, 하비에르 바르뎀, 스텔란 스카스가드, 장첸, 데이브 바티스타, 데이비드 다스트말치안, 샬롯 램플링,"/>
    
            <meta property="fb:app_id" 		id="fbAppId" 	content="546913502790694"/>
            
    
            <meta property="og:site_name" 	id="fbSiteName"	content="메가박스"/>
            <meta property="og:type" 		id="fbType"		content="movie"/>
            <meta property="og:url" 		id="fbUrl"		content="https://www.megabox.co.kr/movie-detail?rpstMovieNo=21058500" />
            <meta property="og:title" 		id="fbTitle"	content="[메가박스]듄" />
            <meta property="og:description"	id="fbDtls"		content="“듄을 지배하는 자가 우주를 지배한다!”10191년, 아트레이데스 가문의 후계자인 폴(티모시 샬라메)은 시공을 초월한 존재이자 전 우주를 구원할 예지된 자의 운명을 타고났다. 그리고 어떤 계시처럼 매일 꿈에서 아라키스 행성에 있는 한 여인을 만난다. 모래언덕을 뜻하는 '듄'이라 불리는 아라키스는 물 한 방울 없는 사막이지만 우주에서 가장 비싼 물질인 신성한 환각제 스파이스의 유일한 생산지로 이를 차지하기 위한 전쟁이 치열하다. 황제의 명령으로 폴과 아트레이데스 가문은 죽음이 기다리는 아라키스로 향하는데…위대한 자는 부름에 응답한다, 두려움에 맞서라, 이것은 위대한 시작이다!"/>
            <meta property="og:image" 		id="fbImg"		content="https://img.megabox.co.kr/SharedImg/2021/09/16/5kxrrz7YXuRfySllsNV3pFwar5WP9vhn_316.jpg" />
            <link rel="stylesheet" href="./MovieInfo.css" media="all" />
    </head>

    <body className="MovieInfoPage">
    <header id="header">
        <div class="container">
            <div class="row">
                <div class="header clearfix">
                    <h1>
                        <Link to="/Main">
                            <em><img src= {pbl_logo} alt="일석이조"/></em>
                        </Link>
                    </h1>
                    <nav id="mNav">
                        <h2 class="ir_so">전체메뉴</h2>
                        <a href="#:" class="ham"><span></span></a>
                    </nav>
                    <nav class="nav">
                        <ul class="clearfix">
                            <Link to='/Moviemenu'>
                                <li><a href="#:">영화</a></li>
                            </Link>
                            <li><a href="#:">영화관</a></li>
                            <li><a href="#:">스토어</a></li>
                            <li><a href="#:">고객센터</a></li>
                            <Link to='/LoginPage'>
                                <li><a href="#:">로그인</a></li>
                            </Link>
                        </ul>
                    </nav>    
                </div>
            </div>
        </div>
    </header>

        <section className="mainpage">
            <div ></div>

            
        

        </section>

    </body>
    </html>
    )

}

export default MovieInfo;