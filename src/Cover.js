import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import Styles3 from "./App.css";
import sign from './assets/SignWithOutW.png'


const Cover = (props) => {
  
    const [showCover, setShowCover] = useState(true);
    const coverHandler = () => {
      setShowCover(false);
    }
    console.log("cover:",showCover,Styles3)
  
    return (<div >
      {showCover?<div className={Styles3.Coverbackground}>
      <div className={Styles3.main}>
    <h1> {props.title}</h1>
    <div className={Styles3.des}>
      <p>{props.line1} </p>
      <p>{props.line2}</p>
      <p>{props.line3} </p>
      <p>...{props.line4} </p>
      <button className={Styles3.rainBtn} onClick = {()=>coverHandler()}>{props.playBtn}</button>
      <div>
      {props.subLine1} </div>
        <div>{props.subLine2} </div>
        <div>{props.subLine3} </div>
      <p id={Styles3.p2}>Made by</p>
      <img id={Styles3.sign} src={sign} />
      <p id={Styles3.p2}>I-Tung Chiang</p>
    </div>
  </div>
  </div>:null}</div>)
  }

  export default Cover;