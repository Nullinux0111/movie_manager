import pbl_logo from "./assets/img/pbl_logo.png";
import React from "react";
import { Link } from "react-router-dom";

function Header(props) {
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
                                <Link to='/Moviemenu' state={state}>
                                    <li>
                                        <a href="#:">영화</a>
                                    </li>
                                </Link>
                                <Link to='/reservation-cinema' state={state}>
                                <li>
                                    <a href="#:">영화관</a>
                                </li>
                                </Link>
                                <li>
                                <a href="#:">스토어</a>
                                </li>
                                <Link to="/StaffCeo" state={state}>
                                <li>
                                    <a href="#:">고객센터</a>
                                </li>
                                </Link>
                                <Link to="/LoginPage" state={state}>
                                <li>
                                    <a href="#:">로그인</a>
                                </li>
                                </Link>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>);
}

export default Header;