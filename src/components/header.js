import React, { Component ,useEffect,useState } from "react";
import { hot } from "react-hot-loader";
import { Link,useLocation } from "react-router-dom";
import sign from "../assets/SignWithOutB.png"
import icon from "../assets/icon.png";
import './header.css';


const Header = () => {

    const handleScroll = (e)=>{

        if(window.scrollY>100&&!isScroll){
            console.log("scroll down !",isScroll); // need to optimize

            setScroll(true);
        }
        else if(window.scrollY<100&&isScroll){
            console.log("back to top!",isScroll);
            setScroll(false);
        }
    }
    

    const [isScroll,setScroll] = useState(false);
    useEffect(()=>{
        window.addEventListener('scroll', handleScroll);});
    return(
    <div className={`${isScroll===true?"header active":"header inactive"}`}>
        <div className="icon_area">
            <img className = "icon"src={icon}></img>
            <Link className="title" to="/home">I-Tung Chiang</Link>
            <img className = "sign"src={sign}></img>
        </div>
        <div className = {`${useLocation().pathname==="/home"||useLocation().pathname==="/"?"links_at_home":null}`}>
        <div className={`${useLocation().pathname==="/"?"links_active":"links_inactive"}`}>
            <Link className={`${useLocation().pathname==="/home"?"header_link_active":"header_link_inactive"}`} to="/home">Home</Link>
            <Link className={`${useLocation().pathname==="/projects"?"header_link_active":"header_link_inactive"}`} to="/projects">Projects</Link>
            <Link className={`${useLocation().pathname==="/about"?"header_link_active":"header_link_inactive"}`} to="/game">Games</Link>
            <a className="header_link_inactive" target="_blank" href="https://drive.google.com/file/d/1US4BngRlP46z3wOFUxALln3-9uyWEBQr/view?usp=sharing">CV</a>
        </div>
        </div>
    </div>
    )
}








export default hot(module)(Header);