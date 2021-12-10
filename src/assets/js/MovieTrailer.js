
//mail
import React, { Component } from "react";
import '../css/style.css';

const trailersrc1 = "https://www.youtube-nocookie.com/embed/W7edvITC9g4" 
const trailersrc2 = "https://www.youtube-nocookie.com/embed/zZaH7ENAkoY" 
const trailersrc3 = "https://www.youtube-nocookie.com/embed/WQ52DhwsJUs" 
const trailersrc4 = "https://www.youtube-nocookie.com/embed/vVSoMobzABo" 
const trailersrc5 = "https://www.youtube-nocookie.com/embed/2G-GaFQSSgQ" 
const trailersrc6 = "https://www.youtube-nocookie.com/embed/egg3dUdD_Js" 
const trailersrc7 = "https://www.youtube-nocookie.com/embed/dWEQjU3GCE0" 
const trailersrc8 = "https://www.youtube-nocookie.com/embed/-5Dc8EMVYBo" 

function trail(id){
  if(id==="20210028"){return trailersrc1;}
  if(id==="20212015"){return trailersrc2;}
  if(id==="20191282"){return trailersrc3;}
  if(id==="20212168"){return trailersrc4;}
  if(id==="20210611"){return trailersrc5;}
  if(id==="20196264"){return trailersrc6;}
  if(id==="20205986"){return trailersrc7;}
  if(id==="20210087"){return trailersrc8;}
  return "wtf";
}

class MovTrailer extends React.Component{
    constructor(props) {
      super();
  
      this.state = {
        menu: 0,
      };
    }

    render(){
        return(
            <div>
                <iframe
                width="800" 
                height="450" 
                src={trail(this.props.cont)} 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
                allowfullscreene>
                    </iframe>
                    </div>
        )
    }
  }
  
  
  export default MovTrailer;