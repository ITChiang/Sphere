import React, { Component, useState, useRef, useEffect } from "react";
import { hot } from "react-hot-loader";
import * as THREE from "three"
import Styles from "./Canvas.css"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';

import s2 from "../public/audio/s2.mp3";
import s4 from "../public/audio/s4.mp3";
import s3 from "../public/audio/s3.mp3";

import playImage from "./assets/playbtn.png";
import Styles2 from './Canvas3D.css';
import playBtn1 from "./assets/play (1).png";
import playBtn2 from "./assets/play (2).png";
import cdBtn1 from "./assets/cd (1).png";
import cdBtn2 from "./assets/cd (2).png";
import pause from './assets/pause.png';
import rgbBtn1 from './assets/rgb (1).png';
import rgbBtn2 from './assets/rgb (2).png';

const FRAMES_PER_SECOND = 6;
const FRAME_MIN_TIME = (1000 / 60) * (60 / FRAMES_PER_SECOND) - (1000 / 60) * 0.5;
var lastFrameTime = 0;  // the last frame time
var nowTime = 0;

//--------three--------------
var camera, scene, renderer, raycaster;
var geometry, material, mesh;
var unitList = [];
var cameraControl;
var newFreq = [];
var oldFreq = [];
var curTime = 0;
var lastTime = 0;
//--------p5-----------------

var sound, fft;
var myP5 = new p5();

//--------para for three.js------

var rangeValue = 0.8;
var colorValue = 6;


const Canvas3DwithP5 = (props) => {

    let setUp = () => {
        sound = myP5.loadSound(s2);
        fft = new p5.FFT(0.7, 256);
        sound.amp(0.2);

    }


    let init = () => {

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        // scene.background = new THREE.Color(0xf0f0f0);


        var pointLight = new THREE.PointLight(0xffffff)
        pointLight.castShadow = true
        pointLight.position.set(0, 0, 30)
        scene.add(pointLight)

        geometry = new THREE.BoxGeometry();
        camera.position.z = 100;

        //-------------------------camera controll-------------------
        cameraControl = new OrbitControls(camera, renderer.domElement)
        cameraControl.maxDistance = 150;
        cameraControl.enablePan = false;
        cameraControl.enableKeys = false;
        cameraControl.enabled = true;
        cameraControl.autoRotate = true;
        cameraControl.rotateSpeed = 2;

        //------------------


    }

    function colorGradient(row, col, index) {  // index control Gradient INDEX SHOULD BE Multiples of 16
        let color = "rgb(" + Math.round((row + index / 2) / index * 255).toString() + "," + Math.round((col + index / 2) / index * 255).toString() + "," + Math.round((col + index / 2) / index * 255).toString() + ")";
        return color
    }

    let colorGradientRG = (cur, total, blue) => {

        total /= 2;
        let r = Math.floor(18 + cur * (255 - 18) / total);
        let g = 255;
        let b = Math.floor(18 * blue);
        if (r >= 254) {
            r = 255;
            g = Math.floor(255 - (cur - total) * (255 - 18) / total);
        }
        return `rgb(${r},${g},${b})`;
    }
    let colorGradientBW = (cur, v) => {
        return `rgb(${Math.floor(255 - cur * 22 * v / 12)},${Math.floor(255 - cur * 22 * v / 12)},${Math.floor(255 - cur * 22 * v / 12)})`;
    }
    let createUnit = () => {
        for (let i = 0; i < 12; i++) {
            let tmp = [];
            for (let j = 0; j < 24; j++) {
                var object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: colorGradientBW(i, 12), wireframe: false }));
                object.position.setFromSphericalCoords(10, Math.PI * i / 12, j / 3);
                object.position.setFromSphericalCoords(40, (Math.PI / 12) * i, j)
                object.lookAt(0, 0, 0);
                // object.position.x = j*15 - 100;
                // object.position.z = i*15 - 100;
                // // object.position.y = -300;



                tmp.push(object);
                scene.add(object);
            }
            unitList.push(tmp);
        }
        //     for(let i = 0 ; i<100;i++){
        //     let tmp = [];

        //     var object = new THREE.Mesh(geometry, new THREE.MeshToonMaterial({ color: colorGradient(i/4, i/8, 5), wireframe: false }));
        //     //object.position.setFromSphericalCoords(10,Math.PI*i/12,j/3);
        //     object.position.x = i*2-50;
        //     //tmp.push(object);
        //     scene.add(object);

        //     unitList.push(object);
        // }

    }
    let animate = () => {
        cameraControl.update();
        requestAnimationFrame(animate);
        render3d();
    };
    let frame = 0;
    let render3d = () => {
        var spec = fft.analyze();
        newFreq = spec;
        //console.log(spec);

        //unitList[0][0].scale.z+=1;
        unitList.map((e, key) => {

            for (let i = 0; i < e.length; i++) {
                // e[i].position.x = Math.sin(frame);
                // e[i].position. = Math.sin(frame);
                frame += 0.1;
                let tmp = myP5.map(spec[key * 10 + i], 0, 16, 1, 16)
                e[i].scale.set(3, 3, tmp * rangeValue / 5);


            }


        })



        renderer.render(scene, camera); // render every frame
    }



    const rangeInput = useRef(0);
    const colorInput = useRef(0);
    const [mode, setMode] = useState(0);
    const [isPlaying, setPlaying] = useState(false);
    const [currentTrack, setTrack] = useState(1);
    //var [rangeValue,setRangeValue] = useState(5);

    useEffect(() => {
        init();
        setUp();
        animate();
        createUnit();
    }, []);


    let playHandler = () => {
        //  props.playBtn();
        if (!sound.isLoaded()) return;
        if (sound.isPlaying()) {
            sound.pause();
            setPlaying(false);
        } else {
            sound.play();
            setPlaying(true);

        }
    }
    const rangeHandler = () => {
        rangeValue = rangeInput.current.value;

    }
    const colorHanlder = () => {
        colorValue = colorInput.current.value;
        if (mode === 1) {
            unitList.map((e, index) => {
                for (let i = 0; i < e.length; i++) {
                    e[i].material.color = new THREE.Color(colorGradientRG(index, 12, colorValue));
                }
            })
        } else if (mode === 0) {
            unitList.map((e, index) => {
                for (let i = 0; i < e.length; i++) {
                    e[i].material.color = new THREE.Color(colorGradientBW(index, colorValue));
                }
            })
        }


    }
    const changeSong = (song) => {
        sound.pause();
        setPlaying(false);
        switch (song) {
            case 1:
                sound = myP5.loadSound(s2);
                setTrack(1);
                break;
            case 2:
                sound = myP5.loadSound(s3);
                setTrack(2);
                break;
            case 3:
                sound = myP5.loadSound(s4);
                setTrack(3);
                break;

            default:
                console.log("have some trouble loading the song");
                break;
        }
    }
    const modeSwitch = () => { // use dom to change background color
        console.log("mode before:", mode);
        if (mode == 0) {
            setMode(1);
            document.body.style.background = "linear-gradient(rgb(20, 20, 20), rgb(20, 20, 20))";
        } else {
            setMode(0);

            document.body.style.background = "linear-gradient(rgb(0, 0, 0), rgb(255, 255, 255))";
        }


    }
    useEffect(() => {
        colorHanlder();
        console.log(playBtn2);
    }, [mode])

    var styles = {
        playBtn: {
            backgroundImage: `url(${playBtn2})`,
            color: "white",
            marginLeft: "30px",
            marginRight: "30px",
            width: "2vh",
            height: "2vh",
            backgroundSize: "1.8vh",
            backgroundColor: "transparent",
            border: "none",
            backgroundRepeat: "no-repeat"

        },
        pauseBtn: {
            backgroundImage: `url(${pause})`,
            color: "white",
            marginLeft: "30px",
            marginRight: "30px",
            width: "2vh",
            height: "2vh",
            backgroundSize: "1.8vh",
            backgroundColor: "transparent",
            border: "none",
            backgroundRepeat: "no-repeat"

        },
        cdBtnLoaded: {
            backgroundImage: `url(${cdBtn1})`,
            color: "white",
            marginRight: "30px",
            width: "2vh",
            height: "2vh",
            backgroundSize: "1.8vh",
            backgroundColor: "transparent",
            border: "none",
            backgroundRepeat: "no-repeat"
        }, cdBtnSelected: {
            backgroundImage: `url(${cdBtn2})`,
            color: "white",
            marginRight: "30px",
            width: "2vh",
            height: "2vh",
            backgroundSize: "1.8vh",
            backgroundColor: "transparent",
            border: "none",
            backgroundRepeat: "no-repeat"
        },
        switchBtnBW: {
            backgroundImage: `url(${rgbBtn1})`,
            marginTop: "4vh",
            margin:'auto',
            width: "2.5vh",
            height: "2.5vh",
            backgroundSize: "2.3vh",
            backgroundColor: "transparent",
            border: "none",
            backgroundRepeat: "no-repeat"

        }, switchBtnC: {
            backgroundImage: `url(${rgbBtn2})`,
            marginTop: "4vh",
            margin:'auto',
            width: "2.5vh",
            height: "2.5vh",
            backgroundSize: "2.3vh",
            backgroundColor: "transparent",
            border: "none",
            backgroundRepeat: "no-repeat"

        },
    }
    return <>
        <div className={Styles2.main}>
            <div className={Styles2.btn}>
                <button className="play-btn" style={!isPlaying ? styles.playBtn : styles.pauseBtn} onClick={() => playHandler()}></button>
                <button className="song-selector" style={currentTrack === 1 ? styles.cdBtnLoaded : styles.cdBtnSelected} onClick={() => changeSong(1)}></button>
                <button className="song-selector"style={currentTrack === 2 ? styles.cdBtnLoaded : styles.cdBtnSelected}  onClick={() => changeSong(2)}></button>
                <button className="song-selector" style={currentTrack === 3 ? styles.cdBtnLoaded : styles.cdBtnSelected}  onClick={() => changeSong(3)}></button>

            </div>
            <div className={Styles2.range}>
                <input type="range" className={Styles2.range_slider} onChange={() => rangeHandler()} min="0.5" max="2" step='0.1' ref={rangeInput}></input>
                <input type="range" className={Styles2.range_slider} onChange={() => colorHanlder()} min="1" max="12" step='0.1' ref={colorInput}></input>
                <button className="mode-selctor" style={mode == 0 ? styles.switchBtnBW : styles.switchBtnC} onClick={() => modeSwitch()}></button>
            </div>
        </div>
    </>
}


export default hot(module)(Canvas3DwithP5);