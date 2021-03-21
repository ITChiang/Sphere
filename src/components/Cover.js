import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import Style from "../App.css";
import sign from '../assets/SignWithOutW.png'


const Cover = (props) => {
    const [showCover, setShowCover] = useState(true);
    const coverHandler = () => {
      setShowCover(false);
    }
  
  
    return (<div >
      {showCover?<div className={Style.Coverbackground}>
      <div className={Style.mainUI}>
    <h1> {props.title}</h1>
    <div className={Style.des}>
      <p>{props.line1} </p>
      <p>{props.line2}</p>
      <p>{props.line3} </p>
      <p>...{props.line4} </p>
      <button className={Style.rainBtn} onClick = {()=>coverHandler()}>{props.playBtn}</button>
      <div>
      {props.subLine1} </div>
        <div>{props.subLine2} </div>
        <div>{props.subLine3} </div>
      <p id={Style.p2}>Made by</p>
      <img id={Style.sign} src={sign} />
      <p id={Style.p2}>I-Tung Chiang</p>
    </div>
  </div>
  </div>:null}</div>)
  }

  export default hot(module)(Cover);