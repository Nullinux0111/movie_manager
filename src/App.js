import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'; //React-Router import
import Main from './Main';
import movie_menu from './movie_menu';

class App extends Component {
  render() {
    return(
      <div>
        <BrowserRouter>
          <Route path="/Main" component={Main} />
          <Route path="/movie_menu" component={movie_menu} />
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
