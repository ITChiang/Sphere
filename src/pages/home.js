import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import { HashRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { Fade, Grow,Slide  } from '@material-ui/core';
import './home.css';
import Background from "../components/Background";
import cover from"../assets/water_cover.jpg";

const introText =`I am I-Tung Chiang, a designer, programmer, and traveler born and raised in Taiwan, keep finding and chasing the beautiful stuff in this world. And dream one day could build something that can solve people's problem in a smoothly way.

Recently, I finished my bachelor degree in Computer Science at Yuan Ze University and Linköping University in Sweden, where I have learned all the ability that a good programmer needed. Before I came to Carnegie Mellon University, I was working as a web developer at Music and Audio Computing Lab, Academia Sinica.

Currently, I am a second-year student studying in the master of entertainment at Carnegie Mellon University.

Besides working and studying, I always enjoy a good cup of milk tea, playing games, and every kind of water sports.`;


const Bio = ()=>(
  <div className="bio_main">
    <Fade in={true} timeout={1200} >
    <div className="bio_title">About</div>
    </Fade>
    <Fade in={true} timeout={1200} >
    <div className ="bio_content">{introText}</div>
    </Fade>
    <Fade in={true} timeout={1200} >
    <div className = "bio_links"></div>
    </Fade>
  </div>
)

class home extends Component {
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
        <Bio/>
        <Slide  direction="left"  in={true} timeout={1200}>
        <div className="half_area"></div>
        </Slide >
        
      </div>
    );
  }

}


export default hot(module)(home);