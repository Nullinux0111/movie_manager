
//mail
import React, { Component } from "react";
import '../css/style.css';

const trailersrc = "https://www.youtube-nocookie.com/embed/-5Dc8EMVYBo" 

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
                src={trailersrc} 
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