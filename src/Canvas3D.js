import React, { Component, useState, useRef, useEffect } from "react";
import { hot } from "react-hot-loader";
import * as THREE from "three"
import Styles from "./Canvas.css"
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import p5 from "p5"
import 'p5/lib/addons/p5.sound'
const FRAMES_PER_SECOND = 6;
const FRAME_MIN_TIME = (1000 / 60) * (60 / FRAMES_PER_SECOND) - (1000 / 60) * 0.5;
var lastFrameTime = 0;  // the last frame time
var nowTime = 0;


var camera, scene, renderer, raycaster;
var geometry, material, mesh;
var unitList = [];
var cameraControl;
var newFreq = [];
var oldFreq = [];
var curTime = 0;
var lastTime = 0;

const Canvas3D = (props) => {

    let init = () => {
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        scene.background = new THREE.Color(0xf0f0f0);


        var pointLight = new THREE.PointLight(0xffffff)
        pointLight.castShadow = true
        pointLight.position.set(0, 0, 8)
        scene.add(pointLight)

        geometry = new THREE.BoxGeometry();
        camera.position.z = 100;

        //-------------------------camera controll-------------------
        cameraControl = new OrbitControls(camera, renderer.domElement)
        cameraControl.maxDistance = 25;
        cameraControl.enablePan = false;
        cameraControl.enableKeys = false;
        cameraControl.enabled = true;
        cameraControl.autoRotate = true;
        cameraControl.rotateSpeed = 2;

        //------------------
        let object = new THREE.Mesh(geometry, new THREE.MeshToonMaterial({ color:"green"} ));
        let object2 = new THREE.Mesh(geometry, new THREE.MeshToonMaterial({ color:"green"} ));
        scene.add(object);
        scene.add(object2);
        let newS = new THREE.Spherical(3,3,3);
        object.position.setFromSphericalCoords(3,3,3);
        object2.position.setFromSphericalCoords(3,1,3);
        console.log("NEWS:",newS.clone());
    }

    function colorGradient(row, col, index) {  // index control Gradient INDEX SHOULD BE Multiples of 16
        let color = "rgb(" + Math.round((row + index / 2) / index * 255).toString() + "," + Math.round((col + index / 2) / index * 255).toString() + "," + Math.round((col + index / 2) / index * 255).toString() + ")";
        return color
    }

    // let createUnit = () => {

    //     for (let i = -4; i < 4; i++) {
    //         let tmp = [];
    //         for (let j = -4; j < 4; j++) {

    //             var object = new THREE.Mesh(geometry, new THREE.MeshToonMaterial({ color: colorGradient(i, j, 10), wireframe: false }));
    //             object.position.x = j;
    //             object.position.y = i;
        
    //             tmp.push(object);

    //             scene.add(object);

    //         }
    //         unitList.push(tmp);

    //     }

    // }
    let createUnit = () =>{
        for(let i = 0 ; i<12;i++){
            let tmp = [];
            for(let j = 0 ; j<24;j++){
            var object = new THREE.Mesh(geometry, new THREE.MeshToonMaterial({ color: colorGradient(i/4, j/8, 5), wireframe: false }));
            object.position.setFromSphericalCoords(10,Math.PI*i/12,j/3);
            tmp.push(object);
            scene.add(object);
            }
            unitList.push(tmp);
        }
     
    }
    let animate = () => {
      
        if(curTime-lastTime > 0.001){
            render3d();
            lastTime =curTime;
            requestAnimationFrame(animate);
            return;
          }
        requestAnimationFrame(animate);
        
    };
    let render3d = () => {
       // console.log(newFreq[100]-oldFreq[100])
       //unitList[0][0].scale.z+=1;
        unitList.map(e => {
            for(let i = 0;i<e.length;i++){
               
                if(newFreq[i]!=null&&oldFreq[i]!=null){
                    let tmp =Math.floor((newFreq[i]-oldFreq[i])/10);
                    e[i].scale.set(1,1,tmp);
               
                    
                    
                }
               
            }
       
        })
        oldFreq= newFreq.slice();

        renderer.render(scene, camera); // render every frame
    }



    useEffect(() => {
        init();
        animate();
        createUnit();

    }, []);
    useEffect(() => { 

        newFreq = props.freq;
        curTime = props.curTime;
         })

    return <></>
}



// class Canvas3D extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             isPlaying: false
//         }
//     }

//     componentDidMount() {
//         console.log("---------componentDidMount------------")
//         this.init();
//         this.animate();
//         this.createUnit();
//         console.log("---------componentDidMount------------")

//     }

//     init = () => {
//         camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
//         scene = new THREE.Scene();

//         renderer = new THREE.WebGLRenderer();
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         document.body.appendChild(renderer.domElement);
//         scene.background = new THREE.Color(0xf0f0f0);


//         var pointLight = new THREE.PointLight(0xffffff)
//         pointLight.castShadow = true
//         pointLight.position.set(0, 0, 8)
//         scene.add(pointLight)

//         geometry = new THREE.BoxGeometry();
//         camera.position.z = 100;

//         //-------------------------camera controll-------------------
//         cameraControl = new OrbitControls(camera, renderer.domElement)
//         cameraControl.maxDistance = 25;
//         cameraControl.enablePan = false;
//         cameraControl.enableKeys = false;
//         cameraControl.enabled = true;
//         cameraControl.autoRotate = true;
//         cameraControl.rotateSpeed = 2;


//     }

//     colorGradient(row, col, index) {  // index control Gradient INDEX SHOULD BE Multiples of 16
//         let color = "rgb(" + Math.round((row + index / 2) / index * 255).toString() + "," + Math.round((col + index / 2) / index * 255).toString() + "," + Math.round((col + index / 2) / index * 255).toString() + ")";
//         return color
//     }

//     createUnit = () => {

//         for (let i = -4; i < 4; i++) {
//             let tmp = [];
//             for (let j = -4; j < 4; j++) {

//                 var object = new THREE.Mesh(geometry, new THREE.MeshToonMaterial({ color: this.colorGradient(i, j, 10), wireframe: false }));
//                 object.position.x = j * 2;
//                 object.position.y = i * 2;


//                 tmp.push(object);

//                 scene.add(object);

//             }
//             unitList.push(tmp);

//         }

//     }

//     animate = () => {
//         requestAnimationFrame(this.animate);
//         this.render3d();
//     };
//     render3d = () => {
//         unitList.map(e => {
//             e.forEach(x => {
//                 x.rotation.x += 0.01;
//                 x.rotation.y += 0.01;
//             })

//         })

//         renderer.render(scene, camera); // render every frame
//     }


//     render() {
//         return <>
//             Testing
//         </>
//     }
// }
export default hot(module)(Canvas3D);