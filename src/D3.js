import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import { testfunction01 } from './components/test01';
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import "./App.css";
import * as THREE from "three";
import * as Tone from 'tone'



var camera, scene, renderer, raycaster;
var geometry, material, mesh;
var unitList = [];
var effectList = [];
var radius = 10, theta = 0;
var mouse = new THREE.Vector2(), INTERSECTED;
var cameraControl;

var drumMap = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]];

var isPlay = false;


var init = () => {

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);


  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  geometry = new THREE.OctahedronGeometry(0.5);
  material = new THREE.MeshBasicMaterial({ color: 'green', wireframe: false });
  material.transparent = true;
  material.opacity = 0.7;


  //-------------light----------------

  var pointLight = new THREE.PointLight(0xffffff)
  pointLight.castShadow = true
  pointLight.position.set(0, 0, 8)
  scene.add(pointLight)
  let pointLightHelper = new THREE.PointLightHelper(pointLight)
  scene.add(pointLightHelper)
  pointLight.visible = true
  pointLightHelper.visible = false

  //-------------mouseMovecam---------




  //----------------------------------

  renderer = new THREE.WebGLRenderer({ antialias: false });
  var cameraControl = new OrbitControls(camera, renderer.domElement)
  cameraControl.maxDistance = 20;
  cameraControl.enablePan = false;
  cameraControl.enableKeys = false;

  camera.position.set(0, 0, 12);
  camera.position.y = 1 * Math.cos(300);
  camera.lookAt(scene.position);


  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('click', onClick, true);
  document.addEventListener('keypress', keyPress);
  renderer.shadowMap.enabled = true;
}

const Sound = () => {
  console.log("sound start")
  const synth = new Tone.Synth().toDestination();
  const kick = new Tone.MembraneSynth({
    octaves: 4,
    envelope: {
      sustain: 0.3,
    }
  }).toDestination();

  const hihat = new Tone.NoiseSynth({
    playbackRate: 1,
    envelope: {
      sustain: 0.00001,
    }
  }).toDestination();
  const now = Tone.now;

  Tone.Transport.scheduleRepeat((time) => {
    // use the callback time to schedule events

    let i = Math.round(Tone.Transport.getSecondsAtTime() * (120 / 60) % 8);
    console.log("I=", i, "and TIme:", Tone.Transport.getSecondsAtTime())

    for (let row = 0; row < unitList.length; row++)beatHandler(row, i);
    if (drumMap[0][i]) kick.triggerAttackRelease("C2", "4n", time);
    if (drumMap[1][i]) synth.triggerAttackRelease("C4", "4n", time);
    if (drumMap[2][i]) hihat.triggerAttackRelease("8n", time);
  }, "4n");
  if (isPlay == false) {
    Tone.Transport.start();
    isPlay = true;
  }
  else {
    Tone.Transport.stop();
    isPlay = false;
  }

}



class CustomSinCurve extends THREE.Curve {

  constructor(scale = 1) {

    super();

    this.scale = scale;

  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {
    console.log(t);
    const tx = 1 - Math.cos(Math.PI) * 2 * t;
    const ty = Math.sin(Math.PI * t);
    const tz = 0;

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);

  }

}


const VisualEffect = () => {
  let curve = new THREE.LineCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 10)
  );
  let baseGeometry = new THREE.TubeBufferGeometry(curve, 10, 0.1, 20, false);
  const geometry = new THREE.SphereBufferGeometry(0.4, 32, 32);
  console.log(unitList)
  for (let i = 0; i < 64; i++) {
    let material = new THREE.MeshBasicMaterial({ color: unitList[Math.floor(i/8)][i%8].material.color });
    let mesh = new THREE.Mesh(geometry, material);
    effectList.push(mesh);
    scene.add(mesh);
    mesh.visible =false;
  }

}
var frame = 0;
var trails = [];
function render() {

  frame+=0.01;

  for (let z = 0; z <64; z++) {
    effectList[z].position.x = Math.cos(frame * 0.1 *Math.PI)*Math.sin(z*64/180) *8;
    effectList[z].position.y = Math.sin(frame * 0.1 *Math.PI)*Math.cos(z*64/180) *8;
    effectList[z].position.z = Math.sin(frame * 0.1 *Math.PI*z*64/180)*8;
  }

  for (let i = 0; i < unitList.length; i++) {
    for (let j = 0; j < unitList[0].length; j++) {

      unitList[i][j].rotation.x += 0.01
      unitList[i][j].rotation.y += 0.01
      if (isTransform) {
        cubeTransform(i, j, 1);
      }


    }
  }

  renderer.render(scene, camera);
}


var animate = () => {
  requestAnimationFrame(animate);
  render();
};

function onDocumentMouseMove(event) {

  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;


}

var isTransform = false;

function keyPress(e) {
  var keyCode = e.keyCode;
  if (keyCode == 65||keyCode == 97  ) {
    console.log("press a");
    if (isTransform)
      isTransform = false;
    else
      isTransform = true
  }
  if (keyCode == 66||keyCode == 98) {
    Sound();
  }
  if (keyCode == 67 ||keyCode == 99) {
    ShowAllEffect();
  }
  if (keyCode == 82||keyCode == 114 ) {
    RandomColor();
  }
}

const ShowAllEffect = ()=>{
  for(let i= 0;i<64;i++){
    effectList[i].visible=true;
  }
}
const RandomColor = ()=>{
  scene.background = new THREE.Color("#1a1a1a")
  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      unitList[i][j].material.color.setStyle(colorGradient(j,i,5));
      effectList[i*8+j].material.color.setStyle(colorGradient(j,i,5));
      console.log(unitList[i][j].material.color);
    }
  }
  
}

const DrumMapController = (x, y) => {
  if (drumMap[x][y] == 0) {
    drumMap[x][y] = 1;
  } else {
    drumMap[x][y] = 0;
  }
  console.log(drumMap);
}

function onClick() {

  raycaster.setFromCamera(mouse, camera);
  let tmp = unitList.flat();
  var intersects = raycaster.intersectObjects(tmp);


  INTERSECTED = null;
  if (intersects.length > 0) {
    if (intersects[0].object.material.wireframe) {
      intersects[0].object.material.wireframe = false;
      DrumMapController(intersects[0].object.position.y + 4, intersects[0].object.position.x + 4);
      effectList[(intersects[0].object.position.y + 4)*8+(intersects[0].object.position.x + 4)].visible=false;
    }
    else {
      intersects[0].object.material.wireframe = true;
      console.log(intersects[0].object.position.x + 4, intersects[0].object.position.y + 4);
      DrumMapController(intersects[0].object.position.y + 4, intersects[0].object.position.x + 4);
      effectList[(intersects[0].object.position.y + 4)*8+(intersects[0].object.position.x + 4)].visible=true;
    

    }

  }

}

function colorGradient(row, col, index) {  // index control Gradient INDEX SHOULD BE Multiples of 16
  let color = "rgb(" + Math.round((row + index / 2) / index * 255).toString() + "," + Math.round((col + index / 2) / index * 255).toString() + "," + Math.round((col + index / 2) / index * 255).toString() + ")";
  return color
}
function createUnit() {


  for (let i = -4; i < 4; i++) {
    let tmp = [];
    for (let j = -4; j < 4; j++) {

      var object = new THREE.Mesh(geometry, new THREE.MeshToonMaterial({ color: colorGradient(i, j, 10), wireframe: false }));
      object.position.x = j
      object.position.y = i


      tmp.push(object);

      scene.add(object);

    }
    unitList.push(tmp);

  }

}
const beatHandler = (row, pos) => {
  if (pos > 0) {
    unitList[row][pos].scale.x = unitList[row][pos].scale.y = unitList[row][pos].scale.z = 1.2;
    unitList[row][pos - 1].scale.x = unitList[row][pos - 1].scale.y = unitList[row][pos - 1].scale.z = 1;
  } else {
    unitList[row][0].scale.x = unitList[row][0].scale.y = unitList[row][0].scale.z = 1.2;
    unitList[row][7].scale.x = unitList[row][7].scale.y = unitList[row][7].scale.z = 1;
  }

}

function cubeTransform(i, j, sign) {
  switch (j % 8) {
    case 4:
      if (unitList[i][j].position.x >= -4) {
        unitList[i][j].position.x -= 0.01 * sign;
        unitList[i][j].position.z -= 0.01 / 2 * sign;
      }

      break;
    case 5:
      if (unitList[i][j].position.x >= -3) {
        unitList[i][j].position.x -= 0.01 * sign;
        unitList[i][j].position.z -= 0.01 / 2 * sign;
      }
      break;
    case 6:
      if (unitList[i][j].position.x >= -2) {
        unitList[i][j].position.x -= 0.01 * sign;
        unitList[i][j].position.z -= 0.01 / 2 * sign;
      }
      break;
    case 7:
      if (unitList[i][j].position.x >= -1) {
        unitList[i][j].position.x -= 0.01 * sign;
        unitList[i][j].position.z -= 0.01 / 2 * sign;
      }
      break;
  }

  switch (i % 8) {
    case 4:
      if (unitList[i][j].position.y >= -4) {
        unitList[i][j].position.y -= 0.01 * sign;
        unitList[i][j].position.z -= 0.01 / 4 * sign;
      }

      break;
    case 5:
      if (unitList[i][j].position.y >= -3) {
        unitList[i][j].position.y -= 0.01 * sign;
        unitList[i][j].position.z -= 0.01 / 4 * sign;
      }

      break;
    case 6:
      if (unitList[i][j].position.y >= -2) {
        unitList[i][j].position.y -= 0.01 * sign;
        unitList[i][j].position.z -= 0.01 / 4 * sign;
      }

      break;
    case 7:
      if (unitList[i][j].position.y >= -1) {
        unitList[i][j].position.y -= 0.01;
        unitList[i][j].position.z -= 0.01 / 4;
      }

      break;
  }


}
class App extends Component {

  componentDidMount() {
    init();
    createUnit();
    VisualEffect();
    animate();


  }

  render() {
    return (
      <div className="App">
      </div>
    );
  }
}

export default hot(module)(App);