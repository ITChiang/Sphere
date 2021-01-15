import React, { Component, useState, useRef } from "react";
import { hot } from "react-hot-loader";
import { HashRouter as Router, Route, Redirect, Switch,withRouter } from "react-router-dom";
import projectList from './projects/project.content'
import { Fade,Grow } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import './project.css';




class project extends Component {
  constructor(props) {
    super();
    this.state = {
      content : ""
    }

  }
  componentDidMount() {
    if(this.props.location.data!==undefined)
    import(`./projects/${this.props.location.data.file_name}/README.md`).then(res=>this.setState({content:res.default}));
  }

  render() {
    return (
      <div className="App">
        <div className="project_Detail">
        <ReactMarkdown  children={this.state.content!==undefined?this.state.content:"NULL"}/>
        </div>
      </div>
    );
  }

}


export default withRouter(project);