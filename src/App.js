import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import "./App.css";
import Visualizer from "./Vis";
import Cover from './components/Cover';

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
      <div className="App">
              <Cover
          title = "Sphere"
          line1 = "Audio visualize with Three.js"
          line2 = "with a little bit of randomness"
          line3 = "Enjoy"
          line4 = "..."
          playBtn = "🌏"
          subLine1 = "Song: Janji - Heroes Tonight [NCS Release] provided by NoCopyrightSounds"
          subLine2 = "Song: Eric - Lovely provided by Eric Godlow Beats"
          subLine3 = "Song: SeriouzBeats - Next Level provided by Rujay"
          />
        <Visualizer />
      </div>
    );
  }

}


export default hot(module)(App);