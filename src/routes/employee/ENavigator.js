import React from "react";
import { Link } from "react-router-dom";
import "./ENavigator.css";

function ENavigator() {
  return (
    <div>
      <Link className="link" to="/employee">
        Main
      </Link>
      <Link className="link" to="/employee/info">
        Information
      </Link>
      <Link className="link" to="/employee/complain">
        Complain
      </Link>
      <Link className="link" to="/">
        Logout
      </Link>
    </div>
  );
}

export default ENavigator;
