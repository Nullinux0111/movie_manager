
//mail
import React, { Component } from "react";
import '../css/style.css';
import '../../slid.css';

import poster01a from '../img/poster01@2.jpg';
import poster02a from '../img/poster02@2.jpg';

class MovStillcut extends React.Component{
    constructor(props) {
      super();
  
      this.state = {
        menu: 0,
      };
    }

    render(){
        return(
            <div>
                <div id="movslideShow"> 
                    <ul class="movslides"> 
                    <li><img src={poster02a} alt=""></img></li>
                    <li><img src={poster01a} alt=""></img></li>
                    <li><img src={poster02a} alt=""></img></li>
                    <li><img src={poster01a} alt=""></img></li>
                    <li><img src={poster02a} alt=""></img></li>
                    <li><img src={poster01a} alt=""></img></li>
                    </ul> 
                    <p class="slidcontroller"> 
                    <span class="slidprev">&lang;</span> 
                    <span class="slidnext">&rang;</span> 
                    </p> 
                    </div> 
                    <script src={'./SlideShow.js'}></script>
            </div>
        )
    }
  }
  
  
  export default MovStillcut;