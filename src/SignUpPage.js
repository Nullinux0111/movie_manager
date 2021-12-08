import './App.css';
import './assets/css/font-awesome.css';
import './assets/css/reset19.css';
import './assets/css/slick.css';
import './assets/css/style19.css';
import './assets/css/swiper.css';
import "./Mypage.css";
import Header from "./Header.js";
import React, { useState } from 'react';
import { Link, Route, useNavigate, useLocation } from 'react-router-dom';

function passwordshow()  {
    const fieldset = document.getElementById('pwd');
    fieldset.type = "text";
}

function passwordhide()  {
    const fieldset = document.getElementById('pwd');
    fieldset.type = 'password';
}

function SignUpPage() {

    const navigate = useNavigate();
    let location = useLocation();

    const refreshPage = ()=>{
        window.location.reload();
    }

    const [id_text, setText] = useState("");
    const [pwd_text, setPWd] = useState("");
    const [name_text, setName] = useState("");
    const [phone_text, setPhone] = useState("");
    const [birthday_text, setBDay] = useState("");
    const [list, setList] = useState(null);
    const [editable, setEditable] = useState(false);

    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e) =>{
        setText(e.target.value);
    };
    const onPwdChange = (e) => {
        setPWd(e.target.value);
    };
    const onNameChange = (e) => {
        setName(e.target.value);
    };
    const onPhoneChange = (e) => {
        setPhone(e.target.value);
    };
    const onBDayChange = (e) => {
        setBDay(e.target.value);
    };
    const onKeyPress = (e) => {
        if(e.key === 'Enter'){
         onEnter(e);
        }
    }

    const plzwork = (e) => {
        passwordshow();

        setEditable(!editable);
    }

    const savechanges = (e) => {

        passwordhide();

        setEditable(!editable);
        //refreshPage();
        //위 코드는 백엔드로 가는 코드를 넣고나면 지우고, refresh page를 활성화해 정보가 바뀌면 이를 갱신하도록 한다.
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
      id: id_text,
      pwd: pwd_text,
      name: name_text, 
      phone: phone_text, 
      birthday: birthday_text

    };
    console.log(JSON.stringify(parameters));
    fetch("http://localhost:3001/customer_join", {
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
        alert(name_text + "님, 성공적으로 가입되었습니다!");
        
        navigate('/');
        refreshPage();
        setLoading(false);
        setIsLoading(false);
    })
    .catch((err) => {
        console.log(err);
        setList(err.message);
        alert("이미 존재하는 아이디입니다.");
        setLoading(false);
        setIsLoading(false);
      });
        
    }
      
        if(loading & !isLoading) {
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
    <body className="MyPage">
        <Header state={location.state}/>

        <section className="MyInfopage">

        <div className="listmaker">

        <div className="myinfo">
            
        <div className="MypageBox">
            

        <p className="LoginText">
          내 정보
        </p>
        
        <div className="idpassword">
        <p className="name">
            이름: <input className="namebox" value={name_text} id='name' onChange={onNameChange}></input>
        </p>
        <p className="id"> 
            아이디: <input className="idbox" value={id_text} id='id' onChange={onChange}></input>
        </p>
        <p className="password">
            비밀번호: <input className="passbox" type='password' value={pwd_text} id='pwd' onChange={onPwdChange}></input>
        </p>
        <p className="phone">
            전화번호: <input className="phonebox" value={phone_text} id='phone' onChange={onPhoneChange}></input>
        </p>
        <p className="birthday">
            생년월일: <input className="birthdaybox" value={birthday_text} id='birthday' onChange={onBDayChange}></input>
        </p>
        
        </div>

        </div>
        
        {/*<p className = "loginProcess">{list}</p>*/}

        <div >
        
        {!editable && <button id="editit" className="loginButton" onClick={plzwork} > 
            비밀번호 보이기
        </button>}
        {editable &&  <button id="acceptit" className="loginButton" onClick={savechanges} > 
            비밀번호 숨기기
        </button>}
        </div>
        <button id="quitit" className="loginButton" onClick={onEnterPost} > 
            가입하기
        </button>

        </div>

        </div>

        </section>

    </body>
  );
}

export default SignUpPage;