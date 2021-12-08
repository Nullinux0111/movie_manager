import { Link, useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { useState } from "react";
import "./LoginPage.css";
import Header from "./Header.js";

function LoginPageEmployee() {
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
      type: "employee"
    };
    
    console.log(JSON.stringify(parameters));
    console.log("employee");
    fetch("http://localhost:3001/login", {
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
        const parameters2 = {
          id: id_text
        };
        return fetch("http://localhost:3001/admin/getDepartment", {
          method: "post", //통신방법
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parameters2),
        })
        .then((res) => res.json())
        .then((res) => {
          if(res["status"]===true){
             
            if(res["data"][1] === "관리자"){
              
              sessionStorage.setItem("CurrentEmployee", id_text); //여기 있는 값은 모두 sessionStorage.getItem("이름");으로 불러온다.
              console.log(sessionStorage.getItem("CurrentEmployee"));
              sessionStorage.setItem("EmployeeCinema", res["data"][0]);
              console.log(sessionStorage.getItem("EmployeeCinem"));
              sessionStorage.setItem("EmployeeDepartment", res["data"][1]);
              console.log(sessionStorage.getItem("EmployeeDepartment"));
              navigate('/StaffCeo');
                window.location.reload();
                setLoading(false);
                setIsLoading(false);
            }
            else if(res["data"][1] === "시설팀"){
              
              sessionStorage.setItem("CurrentEmployee", id_text);
              console.log(sessionStorage.getItem("CurrentEmployee"));
              sessionStorage.setItem("EmployeeCinema", res["data"][0]);
              console.log(sessionStorage.getItem("EmployeeCinem"));
              sessionStorage.setItem("EmployeeDepartment", res["data"][1]);
              console.log(sessionStorage.getItem("EmployeeDepartment"));
              navigate('/StaffMaterial');
                window.location.reload();
                setLoading(false);
                setIsLoading(false);
            }
            else if(res["data"][1] === "매점팀"){
              
              sessionStorage.setItem("CurrentEmployee", id_text);
              console.log(sessionStorage.getItem("CurrentEmployee"));
              sessionStorage.setItem("EmployeeCinema", res["data"][0]);
              console.log(sessionStorage.getItem("EmployeeCinem"));
              sessionStorage.setItem("EmployeeDepartment", res["data"][1]);
              console.log(sessionStorage.getItem("EmployeeDepartment"));
              navigate('/StaffItem');
                window.location.reload();
                setLoading(false);
                setIsLoading(false);
            }
            else{
              alert("존재하지 않는 부서입니다!");
            }
          }
          else{
            alert("아이디 혹은 비밀번호가 일치하지 않습니다.");
          }
              
        })
      })
      .catch((err) => {
        console.log(err);
        setList(err.message);
        setLoading(false);
        setIsLoading(false);
      });
  };

  if (loading & !isLoading) {
    setIsLoading(true);
    setList("waiting for connection...");
  }

  return (
    <body className="LoginPage">
      <Header state={location.state}/>
        <section className="loginmainpage">
        <div className="LoginBox">
          <p className="LoginText">아이디와 비밀번호를 입력해 직원으로 로그인하세요</p>

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

          {/*
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
            

          </div>*/}
          <p className="loginProcess">{list}</p>
        </div>
      </section>
    </body>
  );
}

export default LoginPageEmployee;
