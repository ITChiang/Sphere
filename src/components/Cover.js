import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import "../App.css";
import sign from '../assets/SignWithOutW.png'


const Cover = (props) => {
    const [showCover, setShowCover] = useState(true);
    const coverHandler = () => {
      setShowCover(false);
    }
  
  
    return (<div>
      {showCover?<div className="main">
    <h1> {props.title}</h1>
    <div className="des">
      <p>{props.line1} </p>
      <p>{props.line2}</p>
      <p>{props.line3} </p>
      <p>...{props.line4} </p>
      <button className="rainBtn" onClick = {()=>coverHandler()}>{props.playBtn}</button>
      <div>
      {props.subLine1} </div>
        <div>{props.subLine2} </div>
      <p id="p2">Made by</p>
      <img id="sign" src={sign} />
      <p id="p2">I-Tung Chiang</p>
    </div>
  </div>:null}</div>)
  }

  export default hot(module)(Cover);