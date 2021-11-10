
import { useState } from 'react';

function Test() {

  const [id_text, setText] = useState('');
  const [pwd_text, setPWd] = useState('');

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState(null);

  const onChange = (e) =>{
    setText(e.target.value);
  };
  const onPwdChange = (e) => {
    setPWd(e.target.value);
  }
  const onKeyPress = (e) => {
    if(e.key == 'Enter'){
      onEnterPost(e);
    }
  }

  const onEnter = (e) => {
    setLoading(true);
    fetch(`http://localhost:3001?user=${id_text}&pwd=${pwd_text}&query=select * from student`)
      .then((res) => res.json())
      .then((res) => {
        console.log("res:" + res);
        console.log("res.text:" + res['text']);
        setList(res['text']);
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
    };
    console.log(JSON.stringify(parameters));
    fetch("http://localhost:3001/api",{
      method: "post", //통신방법
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(parameters),
    })
    .then((res) => res.json())
    .then((res) => {
      console.log("res:" + res);
      console.log("res.text:" + res['text']);
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
    <div className="Test">
        <p>
          Type to login to DB.
        </p>
        <a> 
            ID: <input id='id' onChange={onChange}></input>
        </a>
        <a>
            PW: <input id='pwd' onChange={onPwdChange} onKeyPress={onKeyPress}></input>
        </a>
        <p>You try to login as {id_text}</p>
        <p>pw: {pwd_text}</p>
        <p>{list}</p>
      
    </div>
  );
}

export default Test;
