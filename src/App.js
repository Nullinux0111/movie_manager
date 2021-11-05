import React from "react";
import { Link } from "react-router-dom";
import Home from "./routes/Home";

function App() {
  return (
    <div>
      <Home />
      <Link to="/more">More</Link>
      <Link to="/about">About</Link>
    </div>
  );
}

export default App;
