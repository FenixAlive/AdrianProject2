import React, { Component } from "react";

export default class Options extends Component {
  constructor() {
    var _isMounted = false;
    super();
    this.state = {
      time: "",
      nq: -1,
      question: "",
      options: [],
      answer: { opt: "", ans: "" },
      answered: false,
      gameOver: false,
      colors: ["info", "danger", "success", "warning", "secondary"]
    };
    this.handleOpc = this.handleOpc.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if(this.props.answer != undefined){
      var answered = true;
      var answer = this.props.answer
    }else{
      var answered = false;
      var answer;
    }
    this.setState({
      nq: this.props.question.nq,
      question: this.props.question.question,
      options: this.props.question.options,
      answered,
      answer
    })
    
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.answer !== prevState.answer) {
        if(nextProps.answer !== undefined){
          var answered = true;
          var answer = nextProps.answer;
        }else{
            var answered = false;
            var answer = { opt: "", ans: "" };
        }
        return {
          answer: answer,
          answered: answered,
        }
    }
    return null;
}
  handleOpc(option) {
    this.setState(
      {
        answered: true,
        answer: option
      },
      () => {
      }
    );
    let ans = {
      q: this.state.nq,
      ans: option
    };
    this.props.hans(ans);
  }
  handleCancel(){
    this.setState(
      {
        answered: false,
        answer: { opt: "", ans: "" },
      },
      () => {
      }
    );
    let ans = {
      q: this.state.nq,
      ans: undefined
    };
    this.props.hans(ans);
  }
  render() {
    //pregunta contestada
    if (this.state.answered) {
      var options = (
        <div className="my-3 card text-dark">
          <div className="card-header"> Tu Respuesta </div>
          <div className="card-body">
            <span> {this.state.answer.opt}</span>
            <span> {") "+this.state.answer.ans}</span>
          </div>
          <div className="m-3"><button className="btn btn-outline-danger" onClick={this.handleCancel}>Cambiar Respuesta</button></div>
        </div>
      );
    } else {
      var options = (
        <div id="options" className="">
          {this.state.options.map((el, idx) => {
            return (
              <button
                className={
                  "my-3 py-3 btn btn-block btn-" + this.state.colors[idx]
                }
                id={el.opt}
                key={el.opt}
                onClick={() => this.handleOpc(el)}
              >
                <span> {el.opt}) </span> <span> {el.ans} </span>{" "}
              </button>
            );
          })}
        </div>
      );
    }
    return (  
          <div className="container">
            <div className="card bg-dark my-3">
              <div id="question" className="card-header">
                <p className="mx-3 my-3">
                  <b> {this.state.question} </b>
                </p>
              </div>
              <div className="card-text mx-3"> {options} </div>
            </div>
          </div>
      );
  }
}
