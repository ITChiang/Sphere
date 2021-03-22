import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import Style4  from "./App.css";
import Visualizer from "./Vis";
import Cover from './Cover';

class App extends Component {
  constructor(props) {
    super();
    this.state = {
    }

  }
  componentDidMount() {

  }

  render() {
    return (
      <div className={Style4.App}>
              <Cover
          title = "Sphere"
          line1 = "Audio visualize with Three.js and P5.js"
          line2 = "with a little bit of randomness"
          line3 = "Enjoy the beauty of sound"
          line4 = "..."
          playBtn = "🌏"
          subLine1 = "First, upload any audio by click the cloud"
          subLine2 = "Use mouse and wheel to explore"
          subLine3 = "No hints for slider and button, just try it yourself!"
          />
        <Visualizer />
      </div>
    );
  }

}


export default App;