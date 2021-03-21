import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";

import s2 from "../public/audio/s2.mp3";
import s3 from "../public/audio/s3.mp3";
import s4 from "../public/audio/s4.mp3";

import Styles from"./Canvas.css"

import Canvas3D from "./Canvas3D";
import Canvas3DwithP5 from "./Canvas3DwithP5";


let ctx, x_end, y_end, bar_height;
// constants
const width = window.innerWidth;
const height = window.innerHeight;
const bars = 36;
const bar_width = 30;
const radius = 0;
const center_x = width / 2;
const center_y = height / 2;
const FRAMES_PER_SECOND = 6;
const FRAME_MIN_TIME = (1000/60) * (60 / FRAMES_PER_SECOND) - (1000/60) * 0.5;
var lastFrameTime = 0;  // the last frame time
var nowTime = 0;

class Canvas extends Component{
    constructor(props){
        super(props);
        this.audio = new Audio(s3);
        this.audio.volume= 0;
        this.canvas = React.createRef();
        this.state= {
            isPlay:false,
            startPlaying:false,
            ar :[]
        }
    }
    
    componentDidMount(){
        console.log("---------componentDidMount------------")

        console.log("---------componentDidMount------------")
    
    }
    componentWillUnmount() {
        console.log("---------componentWillUnmount------------")
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.source.disconnect();
    }

    
    playBtn = ()=>{
        if(!this.state.startPlaying){
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.source = this.context.createMediaElementSource(this.audio);
            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = 256;
            const bufferLength = this.analyser.fftSize;
            this.source.connect(this.analyser);
            this.analyser.connect(this.context.destination);
            this.frequency_array = new Uint8Array(bufferLength);
            this.setState({
                startPlaying:true
            })
            this.audio.currentTime = 0;
            
        }

        const audio = this.audio;
        console.log("Paused",audio.paused);
        if(audio.paused){
           
            audio.play();
            this.setState({isPlay:true})
            this.rafId = requestAnimationFrame(this.tick);
        }else{
            audio.pause();
            this.setState({isPlay:false})
            cancelAnimationFrame(this.rafId);
        }
    }

    animationLoop(canvas){
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        for (var i = 0; i < bars; i++) {
            //divide a circle into equal part
            const rads = Math.PI * 2 * this.audio.currentTime / bars;

            // Math is magical
            bar_height = this.frequency_array[i] * 10;

            const x = center_x + Math.cos(rads * i) * (radius);
            const y = center_y + Math.sin(rads * i) * (radius);
            x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
            y_end = center_y + Math.sin(rads * i) * (radius + bar_height);

            //draw a bar
           // this.drawBar(x, y, x_end, y_end, this.frequency_array[i], ctx, canvas,i);
            
            this.drawPolygonPath(10,this.frequency_array[i],10,x,y,ctx)
        }
    
    }
    
    drawBar(x1=0, y1=0, x2=0, y2=0, frequency, ctx, canvas,i) {
        // const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        // gradient.addColorStop(0, "rgba(35, 7, 77, 1)");
        // gradient.addColorStop(1, "rgba(204, 83, 51, 1)");
        // ctx.fillStyle = gradient;
        var x= 0;
        var y= 0
        if(i>10){
             x = i%10;
             y = Math.floor(i/10)%10;
        }else{
            x = i;
            y = 0; 
        }
      //  const lineColor = "rgb(" + Math.round(((frequency-160)/2)/5*255) + ", " + Math.round(((frequency-160)/2)/5*255) + ", " + Math.round(((frequency-150)/2)/5*255) + ")";
        const lineColor = "rgb(" + Math.round((x + 5 / 2) / 5 * 255) + ", " + Math.round((y + 5 / 2) / 5 * 255)  + ", " +  Math.round((y + 5 / 2) / 5 * 255)+ ")";
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = bar_width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    drawPolygonPath(sideNum, frequency,radius, originX, originY, ctx){
        ctx.beginPath();
        const unitAngle = Math.PI * 2 / sideNum; 
        const lineColor = "#FD746C";
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 10;
        let angle = 0; 
        let xLength, yLength;
        for(let i = 0; i < sideNum; i++){ 
          xLength = frequency*10* Math.cos(angle);
          yLength = frequency*10* Math.sin(angle);
          ctx.lineTo(originX + xLength, originY - yLength);
          angle += unitAngle;
        }
        ctx.closePath();
        ctx.stroke();
      }
      
    
    tick = () =>{
      if(this.audio.currentTime-lastFrameTime > 0.01){
        // this.animationLoop(this.canvas.current);
        this.analyser.getByteTimeDomainData(this.frequency_array);
        this.setState(
            {ar:this.frequency_array}
        );
        //console.log(this.state.ar);
        this.rafId = requestAnimationFrame(this.tick);
        lastFrameTime =this.audio.currentTime;
        return;
      }
      this.rafId = requestAnimationFrame(this.tick);
     
    }

    render(){
        return<>
        <canvas className={Styles.test}ref={this.canvas}></canvas>  
         {/* <Canvas3D
        freq = {this.state.ar}
        curTime = {this.audio.currentTime}
        ></Canvas3D> */}
        {/* <button className = {Styles.playbtn} onClick ={this.playBtn}>{this.state.isPlay?"play":"pause"}</button>  */}
        <Canvas3DwithP5
        playState = {this.state.isPlay}
        playBtn = {this.playBtn}
        />
        </>
    }
}
export default hot(module)(Canvas);