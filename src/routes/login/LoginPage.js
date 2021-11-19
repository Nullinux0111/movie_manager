import logo from "../../components/logo.png";
import React from "react";
import { useState } from 'react';
import "./LoginPage.css";

function LoginPage() {

    const [id_text, setText] = useState('');
    const [pwd_text, setPWd] = useState('');
    const [list, setList] = useState(null);

    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e) =>{
        setText(e.target.value);
    };
    const onPwdChange = (e) => {
        setPWd(e.target.value);
    } 
    const onKeyPress = (e) => {
        if(e.key === 'Enter'){
         onEnter(e);
        }
    }

    const onEnter = (e) => {
        setLoading(true);
        fetch(`http://localhost:3001?user=${id_text}&pwd=${pwd_text}&query=select * from pc`)
          .then((res) => res.json())
          .then((res) => {
            console.log("res:" + res);
            console.log("res.text:" + res['text']);
            console.log("res.data: " + res['data']);
            var a = res['data'];
            //setList(a[1]);
            setList(res['data']);
            setLoading(false);
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setList(err.message);
            setLoading(false);
            setIsLoading(false);
          })
        
         }
        const onEnterPost = (e) => {
            setLoading(true);
            const parameters = {
            user: id_text,
            pwd: pwd_text,
            query: "select * from student"
        };
            console.log(JSON.stringify(parameters));
            fetch("http://localhost:3001/api",{
            method: "post", //통신방법
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parameters),
        })
        .then((res) => res.json())
        .then((res) => {
            console.log("res:" + res);
            console.log("res.text:" + res['text']);
            console.log("res.data: " + res['data']);
            setList(res['text']);
            setLoading(false);
            setIsLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setList(err.message);
            setLoading(false);
            setIsLoading(false);
        });
        
    }
      
        if(loading & !isLoading) {
            setIsLoading(true);
            setList("waiting for connection...");
        }

    return (
    <body className="LoginPage">
        <header className="HeaderMenu">

        <a href="/" target="_self" title="디비영화관 메인화면으로 가기" >
        <img src={logo} className="Cinema-logo" alt="logo" />
        </a>

        <p>
            영화 예매 스토어 등 헤더 메뉴 추가 가능
        </p>

        </header>

        <section className="loginmainpage">
            <div ></div>

            
        <div className="LoginBox">
            

        <p className="LoginText">
          아이디와 비밀번호를 입력해 로그인하세요
        </p>
        
        <div className="idpassword">
        <p className="id"> 
            ID: <input className="idbox" id='id' onChange={onChange}></input>
        </p>
        <p className="password">
            PW: <input className="passbox" id='pwd' onChange={onPwdChange} onKeyPress={onKeyPress}></input>
        </p>
        
        </div>
        <button className="loginButton" onClick={onEnter}> 
            로그인
        </button>

        <div className = "loginoption">
        <a className = "findid" href="/" target="_self" title="디비영화관 메인화면으로 가기" >
        아이디 찾기
        </a>
        <a className = "findpass" href="/" target="_self" title="디비영화관 메인화면으로 가기" >
        비밀번호 찾기
        </a>
        <a className = "findres" href="/" target="_self" title="디비영화관 메인화면으로 가기" >
        비회원 예매확인
        </a>
        </div>

        <div className = "loginselect" >
        <label><input className = "logincus" type="radio" name="고객직원" value="customer" checked/> 고객</label>
        <label><input className = "loginemp" type="radio" name="고객직원" value="employee"/> 직원</label>
        </div>
        <p className = "loginProcess">{list}</p>
        </div>

        </section>

    </body>
  );
}

export default LoginPage;