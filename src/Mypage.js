import './App.css';
import './assets/css/font-awesome.css';
import './assets/css/reset19.css';
import './assets/css/slick.css';
import './assets/css/style19.css';
import './assets/css/swiper.css';
import "./Mypage.css";
import Header from "./Header.js";
import React, { useState, useEffect } from 'react';
import { Link, Route, useNavigate, useLocation } from 'react-router-dom';
import { init } from 'express/lib/application';

var orig_id = "12345";
var orig_pwd = "";
var orig_name = "홍길동";
var orig_phone = "010-1234-1234";
var orig_bday = "2000-01-01";

function fieldsetDisable(str)  {
    const fieldset = document.getElementById(str);
    fieldset.disabled = true;
}

function fieldsetEnable(str)  {
    const fieldset = document.getElementById(str);
    fieldset.disabled = false;
}

function passwordshow()  {
    const fieldset = document.getElementById('pwd');
    fieldset.type = "text";
}

function passwordhide()  {
    const fieldset = document.getElementById('pwd');
    fieldset.type = 'password';
}

function MyPage() {

    let location = useLocation();
    const navigate = useNavigate();

    const Withdraw = () => {
        var answer = window.confirm("정말로 탈퇴하시겠습니까?");
        if(answer){
            //회원 정보를 제거하는 api 코드
            alert("성공적으로 탈퇴되었습니다!");
            navigate('/');
        }
        else {
    
        }
    }

    const refreshPage = ()=>{
        window.location.reload();
    }

    const [id_text, setText] = useState(orig_id);
    const [pwd_text, setPWd] = useState(orig_pwd);
    const [name_text, setName] = useState(orig_name);
    const [phone_text, setPhone] = useState(orig_phone);
    const [birthday_text, setBDay] = useState(orig_bday);
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
         setInfo(e);
        }
    }

    const plzwork = (e) => {
        fieldsetEnable('name');
        fieldsetEnable('id');
        fieldsetEnable('pwd');
        fieldsetEnable('phone');
        fieldsetEnable('birthday');

        passwordshow();

        setEditable(!editable);
    }

    const savechanges = (e) => {
        console.log(id_text);
        console.log(pwd_text);
        console.log(name_text);
        console.log(phone_text);
        console.log(birthday_text);
        setInfo().then(() => {
            getInfo();
            fieldsetDisable('name');
            fieldsetDisable('id');
            fieldsetDisable('pwd');
            fieldsetDisable('phone');
            fieldsetDisable('birthday');
            setEditable(!editable);
        })
        passwordhide();
        //refreshPage();
        //위 코드는 백엔드로 가는 코드를 넣고나면 지우고, refresh page를 활성화해 정보가 바뀌면 이를 갱신하도록 한다.
    }

    const cancelChanges = (e) => {
        setText(orig_id);
        setName(orig_name);
        setPhone(orig_phone);
        setBDay(orig_bday);
        setPWd("");
        
        fieldsetDisable('name');
        fieldsetDisable('id');
        fieldsetDisable('pwd');
        fieldsetDisable('phone');
        fieldsetDisable('birthday');
        passwordhide();

        setEditable(!editable);
    }

    
    const setInfo = () => {
        setLoading(true);

        var data = {
            id: sessionStorage.getItem("MovieCurrentUser"),
            name: name_text,
            phone: phone_text,
            birthday: birthday_text
        };
        if(pwd_text.replace(/(\s*)/g, "") != ""){
            data.pwd = pwd_text;
            console.log("try to change password");
        }
        
        const parameters = { data: data };
        console.log(JSON.stringify(parameters));

        return fetch("http://localhost:3001/updateCustomerInfo",{
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
            if(!res['status']){
                alert("정보를 수정할 수 없습니다.");
                cancelChanges();
            }
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

    const getInfo = () => {
        console.log("load informations...");
        setLoading(true);
        const parameters = {
            id: sessionStorage.getItem("MovieCurrentUser")
        };
        console.log(JSON.stringify(parameters));
        fetch("http://localhost:3001/viewCustomerInfo",{
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
            setText(parameters['id']);
            setName(res['data'][1]);
            setPhone(res['data'][2]);
            setBDay(res['data'][3]);
            orig_id = parameters['id'];
            orig_name = res['data'][1];
            orig_phone = res['data'][2];
            orig_bday = res['data'][3];

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

    const getReservations = () => {
        setLoading(true);
        const parameters = {
            id: sessionStorage.getItem("MovieCurrentUser")
        };
        console.log(JSON.stringify(parameters));
        fetch("http://localhost:3001/myReservation",{
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

    const initInfo =() => {
        getInfo();
        getReservations();
        return;
    }
    useEffect(() => initInfo(), []);

    if(loading & !isLoading) {
        setIsLoading(true);
        setList("waiting for connection...");
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
            이름: <input className="namebox" value={name_text} id='name' onChange={onNameChange} disabled></input>
        </p>
        <p className="id"> 
            아이디: <input className="idbox" value={id_text} id='id' onChange={onChange} disabled></input>
        </p>
        <p className="password">
            비밀번호: <input className="passbox" type='password' id='pwd' onChange={onPwdChange} disabled></input>
        </p>
        <p className="phone">
            전화번호: <input className="phonebox" value={phone_text} id='phone' onChange={onPhoneChange} disabled></input>
        </p>
        <p className="birthday">
            생년월일: <input className="birthdaybox" value={birthday_text} id='birthday' onChange={onBDayChange} disabled></input>
        </p>
        
        </div>

        </div>
        
        {/*<p className = "loginProcess">{list}</p>*/}

        <div >
        
        {!editable && <button id="editit" className="loginButton" onClick={plzwork} > 
            내 정보 수정하기
        </button>}
        {editable &&  <button id="acceptit" className="loginButton" onClick={savechanges} > 
            수정 완료
        </button>}
        {editable && <button id="undoit" className="loginButton" onClick={cancelChanges} > 
            수정 취소
        </button>}
        </div>

        </div>

        <div className="myinfo">
            
        <div className="MypageBox">
            

        <p className="LoginText">
          예매목록
        </p>
        
        <div className="idpassword">

            내용 및 기능 추가 예정
        
        </div>

        </div>
        
        {/*<p className = "loginProcess">{list}</p>*/}

        <div >
        
        {!editable && <button id="editit" className="loginButton" onClick={plzwork} > 
            예매 하기
        </button>}
        {editable &&  <button id="acceptit" className="loginButton" onClick={savechanges} > 
            수정 완료
        </button>}
        {editable && <button id="undoit" className="loginButton" onClick={refreshPage} > 
            수정 취소
        </button>}
        </div>
        <button id="quitit" className="loginButton" onClick={Withdraw} > 
            예매 취소
        </button>

        </div>

        </div>

        </section>

    </body>
  );
}

export default MyPage;