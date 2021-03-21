import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import Canvas from "./Canvas";
const Visualizer =  () =>{
    return<>
    <header className="header">
        <Canvas/>
    </header>
    </>
}


export default hot(module)(Visualizer);