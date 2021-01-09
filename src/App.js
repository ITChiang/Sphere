import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./App.css";
import * as THREE from "three";
import * as Tone from 'tone';
import music from './assets/music.mp3'
import drop_on from './assets/Drop(2).png';
import drop_off from './assets/Drop(1).png';
import change_on from './assets/exchange(2).png';
import change_off from './assets/exchange(1).png';
import sign from './assets/SignWithOutW.png'
import Cover_Main from './components/Cover'

var camera, scene, renderer, raycaster, clock;
var geometry, material, mesh;
var radius = 10, theta = 0;
var mouse = new THREE.Vector2(), INTERSECTED;
var cameraControl;
var timer = 0;
var clock = new THREE.Clock();

var colorList = ["#76dbca", "#fcff9e", "#ff5959", "#fffef2"]
var squareList = [];

var sound = new Audio(music);
var init = () => {
  sound.loop = true;


  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);

  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  //-------------light----------------

  var pointLight = new THREE.PointLight(0xffffff)
  pointLight.castShadow = true
  pointLight.position.set(-25, 0, 12)
  scene.add(pointLight)
  let pointLightHelper = new THREE.PointLightHelper(pointLight)
  scene.add(pointLightHelper)
  pointLight.visible = false
  pointLightHelper.visible = false;

  renderer = new THREE.WebGLRenderer({ antialias: false });
  var cameraControl = new OrbitControls(camera, renderer.domElement)
  cameraControl.maxDistance = 70;
  cameraControl.enablePan = false;
  cameraControl.enableKeys = false;

  camera.position.set(-40, 0, 30);
  camera.position.y = 1 * Math.cos(300);
  camera.lookAt(scene.position);


  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('click', onClick, true);
  renderer.shadowMap.enabled = true;
}


var isCreate = false;
var tmpTimer = 0;
function rerenderThreejsnder(e) {
  if (e.isPlay) {
    squareCreator(10, 1, 1, e.colorPicker);
    squareHandler(35, 0, 0);

    if (sound.volume < 0.99) {
      sound.volume += 0.005;
    }
  }
  else {
    squareHandler(35, 0, 0);
    if (sound.volume > 0.01) {
      sound.volume -= 0.005;
    } else
      sound.volume = 0;
  }
  // if (Math.floor(timer) % 1 == 0 && isCreate == false) {
  //   tmpTimer = Math.floor(timer);
  //   isCreate = true;
  //   console.log("Create new square!");
  // }

  // if (tmpTimer < Math.floor(timer)) {
  //   isCreate = false;
  // }

  renderer.render(scene, camera);
}

const squareCreator = (startX, startY, startZ, colorPicker) => {
  const geometry = new THREE.BoxBufferGeometry(1.618, 0.01, 1);
  if (colorPicker == 1) {
    var color = colorList[Math.floor(Math.random() * 10 % 4)];
  } else if (colorPicker == 2) {
    var color = colorGradient(Math.random() * 30, 16);
  } else if (colorPicker == 3) {
    let r = Math.random() * 30
    var color = "rgb(" + Math.round(r / 16 * 255).toString() + "," + Math.round(r / 16 * 255).toString() + "," + Math.round(Math.random() * 30 / 16 * 255).toString() + ")";
  } else if (colorPicker == 4) {
    let r = Math.random() * 30
    var color = "rgb(" + Math.round(r / 16 * 255).toString() + "," + Math.round(Math.random() * 30 / 16 * 255).toString() + "," + Math.round(r / 16 * 255).toString() + ")";

  } else if (colorPicker == 5) {
    let r = Math.random() * 30
    var color = "rgb(" + Math.round(r / 16 * 255).toString() + "," + Math.round(r / 16 * 255).toString() + "," + Math.round(r / 16 * 255).toString() + ")";

  }
  const material = new THREE.MeshBasicMaterial({ color: color });
  const square = new THREE.Mesh(geometry, material);
  let ranScale = Math.random() * 1.5;
  square.scale.set(ranScale, 1, ranScale);
  square.position.z = Math.random() * 30 * startZ - 15;
  square.position.x = Math.random() * startX;
  square.position.y = 15 * startY;
  square.rotation.z = 90 * Math.PI / 180;
  squareList.push(square);
  clock = new THREE.Clock();
  clock.start();
  scene.add(square)
}

function colorGradient(r, index) {  // index control Gradient INDEX SHOULD BE Multiples of 16
  let color = "rgb(" + "180" + "," + Math.round(r / index * 255).toString() + "," + Math.round(r / index * 255).toString() + ")";
  return color
}

const squareHandler = (endX, endY, endZ) => {
  if (squareList != null) {
    for (let i of squareList) {
      switch (true) {
        case i.position.y > -5:
          i.position.y -= 0.1 * 1.5 / i.scale.x;
          break;
        case i.position.y < -5 && i.position.x > -endX - 1:
          i.rotation.z = 0;
          i.position.x -= 0.05 * 1.5 / i.scale.x;
          break;
        case i.position.x < -endX && i.position.y > -11:
          i.position.y -= 0.4;
          i.position.x -= 0.08;
          break;
        case i.position.y < -10:
          const index = squareList.indexOf(i);

          if (index > -1) {
            squareList.splice(index, 1);
            scene.remove(i);
          }

      }

    }

  }
}

const onClick = () => {
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(squareList);

  INTERSECTED = null;

  if (intersects.length > 0) {
    if (intersects[0].object.material.wireframe) {
      intersects[0].object.material.wireframe = false;
    }
    else {
      intersects[0].object.material.wireframe = true;
    }

  }
}


function onDocumentMouseMove(event) {

  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;


  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(squareList);

  INTERSECTED = null;

  if (intersects.length > 0) {

    if (intersects[0].object.position.z >= intersects[0].point.z) {
      intersects[0].object.position.z += 1

    } else {
      intersects[0].object.position.z -= 1
    }
  }

}

const Cover = () => {
  const [showCover, setShowCover] = useState(true);
  const coverHandler = () => {
    setShowCover(false);
  }


  return (<div>
    {showCover?<div className="main">
  <h1>RainFall</h1>
  <div className="des">
    <p>Finding inner Peace </p>
    <p>inner Peace </p>
    <p>Peace </p>
    <p>... </p>
    <button className="rainBtn" onClick = {()=>coverHandler()}>💧</button>
    <div>Great Background Music Made By: Prod.Riddiman </div>
      <div>Inspired by By: Falling - yuanchuan </div>
    <p id="p2">Made by</p>
    <img id="sign" src={sign} />
    <p id="p2">I-Tung Chiang</p>
  </div>
</div>:null}</div>)
}

class WaterFall extends Component {
  constructor(props) {
    super();
    this.state = {
      isPlay: false,
      animateID: "",
      colorPicker: 2,
      dropPic: drop_off,
      randomPic: change_off
    }
    this.animationHandler = this.animationHandler.bind(this);
    this.animate = this.animate.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.hoverRandom = this.hoverRandom.bind(this);
  }
  componentDidMount() {
    init();
    let id = this.animate(this.state.isPlay);
    this.setState({ isPlay: false, animateID: id })

  }
  animationHandler() {
    if (this.state.isPlay) {
      this.setState({ isPlay: false, dropPic: drop_off });

    } else {
      this.setState({ isPlay: true, dropPic: drop_on });
      console.log("start!");
      sound.play();
    }

  }
  changeColor() {
    if (this.state.colorPicker < 5) { // max: 3
      this.setState({ colorPicker: this.state.colorPicker += 1 })
    } else {
      this.setState({ colorPicker: 1 })
    }

  }
  animate() {
    timer += clock.getDelta();
    let _id = window.requestAnimationFrame(this.animate);
    rerenderThreejsnder(this.state);
    if (this.state.animateID != _id) {
      this.setState({ animateID: _id })
    }
    return _id;
  };
  hoverRandom() {
    if (this.state.randomPic == change_off) {
      this.setState({
        randomPic: change_on
      })
    } else {
      this.setState({
        randomPic: change_off
      })
    }
  }
  render() {
    return (
      <div className="App">
        <div className="Cover">
          <Cover_Main
          title = "RainFall"
          line1 = "Finding inner Peace"
          line2 = "inner Peace"
          line3 = "Peace"
          line4 = "..."
          playBtn = "💧"
          subLine1 = "Great Background Music Made By: Prod.Riddiman"
          subLine2 = "Inspired by By: Falling - yuanchuan"
          />
        </div>
        <div className="mainUI">
          <div id="top_text">RainFall</div>
          <img src={this.state.dropPic} className="dropBtn" onClick={() => this.animationHandler()} />
          <img src={this.state.randomPic} className="dropBtn change" onClick={() => this.changeColor()} onMouseEnter={() => this.hoverRandom()} onMouseLeave={() => this.hoverRandom()} />
          <div id="bot_text"><a href="http://itungchiang.com">I-Tung Chiang 2021</a></div>
        </div>

      </div>
    );
  }
}

export default hot(module)(WaterFall);