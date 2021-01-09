import React from "react";
import ReactDOM from "react-dom";
import Favicon from 'react-favicon';
import App from "./App.js";
import App_2 from "./D3.js";
import icon from "./assets/favicon.ico"


ReactDOM.render(
<div>
    <Favicon url ={icon}></Favicon>
    <App/></div>
, document.getElementById("root"));