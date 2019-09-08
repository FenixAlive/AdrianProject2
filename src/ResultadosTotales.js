import React, { Component } from "react";
import ResUser from "./ResUser";

export default class ResultadosTotales extends Component {
  constructor() {
    var _isMounted = false;
    super();
    this.state = {
      answers: {},
      results: {}
    };
  }
  componentDidMount() {
    this._isMounted = true;
    if(this._isMounted) {
        this.setState({
            answers: this.props.ans,
            results: this.props.res
        })
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    if (this.props.admin && this.props.gameOver) {
      console.log(this.props.question)
      return (
        <div className="card bg-dark text-white my-5">
          <table className="table table-bordered table-sm table-dark">
            <thead>
              <tr>
                <th scope="col"> Usuario </th>
                {   this.state.results.hasOwnProperty("admin") ?
                    this.state.results.admin.map((item, keyi)=>{
                        return (<th key={keyi} scope="col"> Pregunta {keyi+1} </th>)
                    })
                : <th />
                }
                <th scope="col"> Total </th>
              </tr>
            </thead>
            <tbody>
                {this.state.results.hasOwnProperty("admin") ?
                    Object.keys(this.state.results).map((el, keyUs)=>{
                        return <ResUser key={keyUs} user={el} res={this.state.results[el]} ans={this.state.answers[el]} />
                    })
                : <tr />
                }
            </tbody>
          </table>
        </div>
      );
    } else {
      return <React.Fragment />;
    }
  }
}
