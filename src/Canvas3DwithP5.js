import React, { Component, useState, useRef, useEffect } from "react";
import { hot } from "react-hot-loader";
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';

import Styles2 from './Canvas3D.css';

import playBtn2 from "./assets/play (2).png";

import pause from './assets/pause.png';
import rgbBtn1 from './assets/rgb (1).png';
import rgbBtn2 from './assets/rgb (2).png';
import upload from './assets/upload.png';
import upload2 from './assets/upload (2).png';

//--------three--------------
var camera, scene, renderer;
var geometry;
var unitList = [];
var cameraControl;
//--------p5-----------------
var newFreq;
var sound, fft;
var myP5 = new p5();

//--------para for three.js------

var rangeValue = 0.8;
var colorValue = 6;


const Canvas3DwithP5 = (props) => {
    let setUp = () => {
        fft = new p5.FFT(0.7, 256);
    }

    let init = () => {

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);


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
                tmp.push(object);
                scene.add(object);
            }
            unitList.push(tmp);
        }


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
        unitList.map((e, key) => {

            for (let i = 0; i < e.length; i++) {
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
    const [uploaded, setUploaded] = useState(false);

    useEffect(() => {
        init();
        setUp();
        animate();
        createUnit();
    }, []);


    let playHandler = () => {
        if(sound==undefined){
            alert('Upload some audio :)')
            return;
        } 
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
    const modeSwitch = () => { // use dom to change background color
        if (mode == 0) {
            setMode(1);
            document.body.style.background = "linear-gradient(rgb(20, 20, 20), rgb(20, 20, 20))";
        } else {
            setMode(0);
            document.body.style.background = "linear-gradient(rgb(0, 0, 0), rgb(255, 255, 255))";
        }


    }
    const audioUploadHandler = (e) => {
        let file = e.target.files[0];
        console.log(file.type.split('/'));
        if (file.type.split('/')[0] === 'audio') {
            sound = myP5.loadSound(file, () => { sound.play(); setPlaying(true); setTrack(4) });
            setUploaded(true);
        }
        else {
            alert("Audio file Plz :)")
        }
    }
    useEffect(() => {
        colorHanlder();
        console.log(playBtn2);
    }, [mode])

    var styles = {
        playBtn: {
            backgroundImage: `url(${playBtn2})`,
            marginTop: "auto",
            marginRight: "2vw",
            width: "2.5vh",
            height: "2.5vh",
            backgroundSize: "2.5vh",
            backgroundColor: "transparent",
            border: "none",
            backgroundRepeat: "no-repeat"

        },
        pauseBtn: {
            backgroundImage: `url(${pause})`,
            marginTop: "auto",
            marginRight: "2vw",
            width: "2.5vh",
            height: "2.5vh",
            backgroundSize: "2.5vh",
            backgroundColor: "transparent",
            border: "none",
            backgroundRepeat: "no-repeat"

        },
        switchBtnBW: {
            backgroundImage: `url(${rgbBtn1})`,
            marginTop: "4vh",
            margin: 'auto',
            marginLeft: "2vw",
            marginRight: "2vw",
            width: "3vh",
            height: "3vh",
            backgroundSize: "2.9vh",
            backgroundColor: "transparent",
            border: "none",
            backgroundRepeat: "no-repeat"

        }, switchBtnC: {
            backgroundImage: `url(${rgbBtn2})`,
            marginTop: "4vh",
            margin: 'auto',
            marginLeft: "2vw",
            marginRight: "2vw",
            width: "3vh",
            height: "3vh",
            backgroundSize: "2.9vh",
            backgroundColor: "transparent",
            border: "none",
            backgroundRepeat: "no-repeat"

        }, uploadBtn: {
            backgroundImage: `url(${upload2})`,
            marginRight: "auto",
            marginLeft: "2vw",
            marginRight: "2vw",
            width: "3vh",
            height: "3vh",
            backgroundSize: "3vh",
            backgroundColor: "transparent",
            border: "none",
            backgroundRepeat: "no-repeat"

        }, uploadBtnSelect: {
            backgroundImage: `url(${upload})`,
            marginRight: "auto",
            marginLeft: "2vw",
            marginRight: "2vw",
            width: "3vh",
            height: "3vh",
            backgroundSize: "3vh",
            backgroundColor: "transparent",
            border: "none",
            backgroundRepeat: "no-repeat"

        }
    }
    return <>
        <div className={Styles2.main}>
            <div className={Styles2.btn}>
                <button className="play-btn" style={!isPlaying ? styles.playBtn : styles.pauseBtn} onClick={() => playHandler()}></button>
                <button className="mode-selctor" style={mode == 0 ? styles.switchBtnBW : styles.switchBtnC} onClick={() => modeSwitch()}></button>
                <label for='audio-upload' style={uploaded ? styles.uploadBtn : styles.uploadBtnSelect}></label>
                <input type="file" id="audio-upload" style={{ display: "none", paddingBottom: '300px' }} onChange={audioUploadHandler}></input>
            </div>
            <div className={Styles2.range}>
                <input type="range" className={Styles2.range_slider} onChange={() => rangeHandler()} min="0.5" max="2" step='0.1' ref={rangeInput}></input>
                <input type="range" className={Styles2.range_slider} onChange={() => colorHanlder()} min="1" max="12" step='0.1' ref={colorInput}></input>
            </div>
        </div>
    </>
}


export default hot(module)(Canvas3DwithP5);