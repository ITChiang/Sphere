import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import Canvas3DwithP5 from "./Canvas3DwithP5";
const Visualizer =  () =>{
    return<>
    <header className="header">
        <Canvas3DwithP5/>
    </header>
    </>
}


export default hot(module)(Visualizer);