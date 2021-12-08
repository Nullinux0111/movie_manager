import { Link, useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { useState } from "react";
import "./LoginPage.css";
import Header from "./Header.js";

function getCusEmp() {

  var cusemp = document.querySelector('input[name="고객직원"]:checked').value;
  return (cusemp==="customer" ? "login" : "notyet" );

}

function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();

  const [id_text, setText] = useState("");
  const [pwd_text, setPWd] = useState("");
  const [list, setList] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e) => {
    setText(e.target.value);
  };
  const onPwdChange = (e) => {
    setPWd(e.target.value);
  };
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onEnterPost(e);
    }
  };
  
  const onEnter = (e) => {
    setLoading(true);
    fetch(
      `http://localhost:3001?user=${id_text}&pwd=${pwd_text}&query=select * from pc`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log("res:" + res);
        console.log("res.text:" + res["text"]);
        console.log("res.data: " + res["data"]);
        var a = res["data"];
        //setList(a[1]);
        setList(res["data"]);
        setLoading(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setList(err.message);
        setLoading(false);
        setIsLoading(false);
      });
  };
  const onEnterPost = (e) => {
    setLoading(true);
    const parameters = {
      id: id_text,
      pwd: pwd_text,
    };
    const LoginSection = getCusEmp();
    
    console.log(JSON.stringify(parameters));
    console.log(getCusEmp());
    fetch("http://localhost:3001/"+getCusEmp(), {
      method: "post", //통신방법
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parameters),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res:" + res);
        console.log("res.text:" + res["status"]);
        setList(res["status"]);
        sessionStorage.setItem("MovieCurrentUser", id_text);
        console.log(sessionStorage.getItem("MovieCurrentUser"));
        navigate("/");
        window.location.reload();
        setLoading(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setList(err.message);
        alert("아이디 혹은 비밀번호가 일치하지 않습니다.");
        setLoading(false);
        setIsLoading(false);
      });
  };

  if (loading & !isLoading) {
    setIsLoading(true);
    setList("waiting for connection...");
  }

  function moveMovie(event) {
    event.preventDefault();
    navigate("/Moviemenu", { state: { cinema: false, movie: false } });
  }

  function moveCinema(event) {
    event.preventDefault();
    navigate("/reservation-cinema", { state: { cinema: false, movie: false } });
  }

  return (
    <body className="LoginPage">
      <Header state={location.state}/>
        <section className="loginmainpage">
        <div className="LoginBox">
          <p className="LoginText">아이디와 비밀번호를 입력해 로그인하세요</p>

          <div className="idpassword">
            <p className="id">
              ID: <input className="idbox" id="id" onChange={onChange}></input>
            </p>
            <p className="password">
              PW:{" "}
              <input
                className="passbox"
                id="pwd"
                onChange={onPwdChange}
                onKeyPress={onKeyPress}
              ></input>
            </p>
          </div>
          <button className="loginButton" onClick={onEnterPost}>
            로그인
          </button>

          <div className="loginoption">
            <a
              className="signup"
              href="/SignUpPage"
              target="_self"
              title="디비영화관 메인화면으로 가기"
            >
              회원가입
            </a>
            <a
              className="findid"
              href="/"
              target="_self"
              title="디비영화관 메인화면으로 가기"
            >
              아이디 찾기
            </a>
            <a
              className="findpass"
              href="/"
              target="_self"
              title="디비영화관 메인화면으로 가기"
            >
              비밀번호 찾기
            </a>
            <a
              className="findres"
              href="/"
              target="_self"
              title="디비영화관 메인화면으로 가기"
            >
              비회원 예매확인
            </a>

          </div>

          <div className="loginselect">
            <label>
              <input
                className="logincus"
                type="radio"
                name="고객직원"
                value="customer"
                checked
              />{" "}
              고객
            </label>
            <label>
              <input
                className="loginemp"
                type="radio"
                name="고객직원"
                value="employee"
              />{" "}
              직원
            </label>
          </div>
          <p className="loginProcess">{list}</p>
        </div>
      </section>
    </body>
  );
}

export default LoginPage;
