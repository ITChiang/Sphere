import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import { HashRouter as Router, Route, Redirect, Switch, useHistory } from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import { Fade, Grow } from '@material-ui/core';
import projectList from './projects/project.content'
import "./projects.css";



const ProjectElement = (props) => {
  const history = useHistory();
  console.log("histroy is ", history);
  const handlerOnClick = (p) => {
    let fileName = p.toLowerCase();
    history.push({
      pathname: '/project',
      data: { file_name: fileName }
    })
    console.log('history push!!!');
  }

  return (
    <div className="projectListElement">
      <Fade in={true} timeout={1200} >
        <div className="project_title" onClick={() => handlerOnClick(props.title)}>{props.title}</div>
      </Fade>
      <div className="project_main">
        <Grow in={true} timeout={1200}>
            <img className="project_img" src={props.img}></img>
        </Grow>
        <div className = "project_img_middle" onClick={() => handlerOnClick(props.title)}></div>
        <Fade in={true} timeout={1200} >
          <div className="projectCategoryList">
            {props.category.map((p, key) => {
              console.log(p);
              return (
                <div key={key}>
                  <div className="project_category" target="_blank" >{p}</div>
                </div>
              )
            })}
          </div>
        </Fade>
        <Fade in={true} timeout={1200} >
          <p className="project_content">{props.content}</p>
        </Fade>
        <Fade in={true} timeout={1200} >
          <div className="projectLinkList">
            {props.links.map((p, key) => {
              console.log(p);
              return (
                <div key={key}>
                 <li> <a className="project_link" target="_blank" href={p.url}>{p.name}</a></li>
                </div>
              )
            })}
          </div>
        </Fade>
      </div>
    </div>

  )
}

const Projects = () => (
  <div className="projects">
    {projectList.map((p, key) => {
      console.log(p);
      return (
        <div>
          <ProjectElement
            title={p.title}
            links={p.links}
            category={p.category}
            content={p.content}
            img={p.img}
            key={key}
          />
          {key < projectList.length - 1 ? <hr /> : ''}
        </div>
      )
    })}
  </div>




)

export default hot(module)(Projects);