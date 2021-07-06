import React, { Component } from 'react';
import ReactImage from './react.png';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import EmailGenerator from './pages/EmailGenerator.js'

export default class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/">
              <EmailGenerator />
            </Route>
          </Switch>
        </div>
      </Router>

    );
  }
}
