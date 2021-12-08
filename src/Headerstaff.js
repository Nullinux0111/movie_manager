import pbl_logo from "./assets/img/pbl_logo.png";
import React from "react";
import { Link, useNavigate } from "react-router-dom";


var user = sessionStorage.getItem("MovieCurrentUser");
console.log(user);

function Header(props) {
    let navigate = useNavigate();

    function logoutSession(){
        sessionStorage.removeItem("MovieCurrentUser");
        alert("성공적으로 로그아웃 되었습니다!");
        navigate("/");
        window.location.reload();
    }

    var state = {};
    if(props.state)
        state = props.state;
    else{
        state.cinema = false;
        state.movie = false;
    }

    return (
        <header id="header">
            <div class="container">
                <div class="row">
                    <div class="header clearfix">
                        <h1>
                        <Link to="/Main" state={state}>
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
                                <Link to="/LoginPage" state={state}>
                                {user==null && <li>
                                    <a href="#:">로그인</a>
                                </li>}
                                </Link>
                                <Link to="/" state={state}>
                                {user!=null && <li>
                                    <a href="#:" onClick={logoutSession}>로그아웃</a>
                                </li>}
                                </Link>
                                <Link to="/MyPage" state={state}>
                                {user!=null && <li>
                                    <a href="#:">내정보</a>
                                </li>}
                                </Link>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>);
}

export default Header;