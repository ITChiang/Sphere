import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import { HashRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import Home from './pages/home';
import Projects from './pages/projects';
import Project from './pages/project';
import About from './pages/about';
import Intro from './pages/intro';
import Header from './components/header';

class App extends Component {
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
        <Router >
        <Header/>
        <div className="container">
         <Route exact path="/" component = {()=><Intro></Intro>}/>
          <Route exact path="/home" component = {()=><Home></Home>}/>
          <Route exact path="/about" component = {()=><About></About>}/>
          <Route exact path="/projects" component = {()=><Projects></Projects>}/>
          <Route exact path="/project" component = {()=><Project></Project>}/>
          </div>
        </Router>
        <div className ="footer">Made by I-Tung Chaing, 2021</div>
      </div>
    );
  }

}


export default hot(module)(App);