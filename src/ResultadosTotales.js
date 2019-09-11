import React, { Component } from "react";
import ResUser from "./ResUser";
import DetalleRespuestas from "./DetalleRespuestas"

export default class ResultadosTotales extends Component {
  constructor(props) {
    var _isMounted = false;
    super(props);
    this.state = {
      answers: {},
      results: {},
      detalle: '',
      passwords: {}
    };
    this.handleDetalle = this.handleDetalle.bind(this);
    this.handleLimpiarDetalle = this.handleLimpiarDetalle.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    if(this._isMounted) {
        this.setState({
            answers: this.props.ans,
            results: this.props.res,
            detalle: false,
            passwords: this.props.passwords
        })
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  handleDetalle(user){
    this.setState({
        detalle: user
    })
  }
  handleLimpiarDetalle(){
    this.setState({
        detalle: ''
    })
  }
  render() {
    if(this.props.liberarDetalle){
      var liberarDetalle;
    }else{
      var liberarDetalle = <button className="btn btn-outline-success btn-block my-3" onClick={this.props.handleLiberarDetalle}>Liberar Respuestas a Usuarios</button>
    }
    if (this.props.admin && this.props.gameOver) {
      if(this.state.detalle == ''){
        return (
          <div className="card bg-dark text-white my-5">
            <div className="card-header">Respuestas Generales</div>
            <div className="card-body">
              {liberarDetalle}
              <table className="table table-sm table-dark table-hover">
                <thead>
                  <tr>
                    <th scope="col">Usuario</th>
                    <th scope="col">Contraseña</th>
                    <th scope="col">Calificación</th>
                    <th scope="col">Detalle</th>
                  </tr>
                </thead>
                <tbody>
                    {this.state.results.hasOwnProperty("admin") ?
                        Object.keys(this.state.results).map((el, keyUs)=>{
                            return <ResUser key={keyUs} 
                                      user={el} 
                                      res={this.state.results[el]} 
                                      ans={this.state.answers[el]} 
                                      detalle={this.handleDetalle}
                                      password={this.state.passwords[el]}
                                    />
                        })
                    : <tr />
                    }
                </tbody>
              </table>
            </div>
          </div>
        );
      }else{
        return (
          <div className="card bg-dark text-white my-5">
            <div className="card-header">Detalle de Respuestas del Usuario: <b className="mx-2">{this.state.detalle}</b></div>
            <div className="card-body">
              <button className="btn btn-block btn-outline-info" onClick={this.handleLimpiarDetalle}>Regresar a Listado de Usuarios</button>
              <DetalleRespuestas 
                user={this.state.detalle} 
                res={this.state.results[this.state.detalle]} 
                ans={this.state.answers[this.state.detalle]} 
                questions={this.props.questions}
                correctAns ={this.props.correctAns}
              />
            </div>
          </div>
        );
      }
    } else {
      return <React.Fragment />;
    }
  }
}
/*
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
*/