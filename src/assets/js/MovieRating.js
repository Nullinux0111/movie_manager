//mail
import React, { Component } from "react";
import '../css/style.css';
import '../css/rating.css';

const rate = 4.4

//나중에 백엔드에서 별점 관련 자료를 끌고올 것

function ratingToPercent() {
    const score = rate * 20;
    return score;
}

class MovRating extends React.Component{
    constructor(props) {
      super();
  
      this.state = {
        menu: 0,
      };
    }

    render(){
        return(
            <div>

                <div class="star-ratings">
	        <div 
            class="star-ratings-fill space-x-2 text-lg"
            style={{width: ratingToPercent() + '%' }}
            >
		        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
	        </div>
            
	        <div class="star-ratings-base space-x-2 text-lg">
		    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
	        </div>

            </div>

            <div class="rating">{rate}/5점</div>
            

            </div>
        )
    }
  }
  
  
  export default MovRating;