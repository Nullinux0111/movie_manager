import React from "react";
import { Link } from "react-router-dom";

function ENavigator() {
  if(0==0){ //for member
    return (
      <div>
        <Link className="link" to="/customer">
          Main
        </Link>
        <Link className="link" to="/customer/info">
          Information
        </Link>
        <Link className="link" to="/movie">
          Movie
        </Link>
        <Link className="link" to="/reserv">
          Reservation
        </Link>
        <Link className="link" to="/complain">
          Complain
        </Link>
        <Link className="link" to="/">
          Logout
        </Link>
      </div>
    );
  }
  else{ //for non member
    return (
      <div>
        <Link className="link" to="/movie">
          Movie
        </Link>
        <Link className="link" to="/reserv">
          Reservation
        </Link>
        <Link className="link" to="/complain">
          Complain
        </Link>
        <Link className="link" to="/">
          Logout
        </Link>
      </div>
    );
  }
}

export default ENavigator;
