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
      colors: ["primary", "danger", "success", "warning", "secondary", "info"]
    };
    this.handleOpc = this.handleOpc.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  handleOpc(option) {
    this.setState(
      {
        answered: true,
        answer: option
      },
      () => {
        sessionStorage.setItem("stateQuestion", JSON.stringify(this.state));
      }
    );
    let ans = {
      q: this.state.nq,
      ans: option.opt
    };
    this.props.hans(ans);
  }
  render() {
    console.log("option question",this.props.question)
    //pregunta contestada
    if (this.state.answered) {
      //boton siguiente pregunta
      var options = (
        <div className="my-3 card text-dark">
          <div className="card-header"> Tu Respuesta </div>
          <div className="card-body">
            <span> {this.state.answer.opt}</span>
            <span> {") "+this.state.answer.ans}</span>
          </div>
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
