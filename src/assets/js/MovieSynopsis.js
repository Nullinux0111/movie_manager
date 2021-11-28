
//mail
import React, { Component } from "react";
import '../css/style.css';
const synopsis = '“듄을 지배하는 자가 우주를 지배한다!” \n\n10191년, 아트레이데스 가문의 후계자인 폴(티모시 샬라메)은 시공을 초월한 존재이자\n전 우주를 구원할 예지된 자의 운명을 타고났다.\n그리고 어떤 계시처럼 매일 꿈에서 아라키스 행성에 있는 한 여인을 만난다.\n모래언덕을 뜻하는 \'듄\'이라 불리는 아라키스는 물 한 방울 없는 사막이지만\n우주에서 가장 비싼 물질인 신성한 환각제 스파이스의 유일한 생산지로 이를 차지하기 위한 전쟁이 치열하다.\n황제의 명령으로 폴과 아트레이데스 가문은 죽음이 기다리는 아라키스로 향하는데…\n\n위대한 자는 부름에 응답한다, 두려움에 맞서라, 이것은 위대한 시작이다!';
//나중에 백엔드에서 끌고올 것

class MovSynopsis extends React.Component{
    constructor(props) {
      super();
  
      this.state = {
        menu: 0,
      };
    }

    render(){
        return(
            <div><pre class="synopsis">{synopsis}</pre></div>
        )
    }
  }
  
  
  export default MovSynopsis;