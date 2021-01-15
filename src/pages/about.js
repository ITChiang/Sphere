import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import { HashRouter as Router, Route, Redirect, Switch } from "react-router-dom";




class About extends Component {
  constructor(props) {
    super();
    this.state = {
    }

  }
  componentDidMount() {

  }

  render() {
    return (
      <div className="App">
        <div>About</div>
      </div>
    );
  }

}


export default hot(module)(About);