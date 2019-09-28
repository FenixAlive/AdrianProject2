import React, { Component } from "react";
import ResUser from "./ResUser";
import OpcionesResultados from './OpcionesResultados'

export default class ResultadosTotales extends Component {
  constructor(props) {
    var _isMounted = false;
    super(props);
    this.state = {
      detalle: '',
      users: {},
      username: ''
    };
    this.handleDetalle = this.handleDetalle.bind(this);
    this.handleLimpiarDetalle = this.handleLimpiarDetalle.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    if(this._isMounted) {
        this.setState({
            users: this.props.datosUsuarios,
            username: this.props.user
        })
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.datosUsuarios !== prevState.datosUsuarios) {
        if(nextProps.datosUsuarios && nextProps.admin){
            return {
                users: nextProps.datosUsuarios,
                username: nextProps.user
            }
        }
    }
        return null;
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
    if(this.props.estadoJuego.liberarDetalle){
      var liberarDetalle;
    }else{
      var liberarDetalle = <button className="btn btn-outline-success btn-block my-3" onClick={this.props.handleLiberarDetalle}>Liberar Respuestas a Usuarios</button>
    }
    if (this.props.admin && this.props.userOk && (this.props.estadoJuego.gameBegin || this.props.estadoJuego.gameEnd) && this.state.users[this.state.username]) {
      if(this.state.detalle == ''){
        return (
          <div className="container">
            <div className="card bg-dark text-white my-5">
                        <div className="card-header">Resultados del Administrador</div>
                        <div className="card-body">
                            <div>Respuestas correctas: <b className="mx-2">{this.state.users[this.state.username].puntajeTotalUser}</b></div>
                            <div>Total de preguntas: <b className="mx-2">{this.props.estadoJuego.totpreg}</b></div>
                            <div>Calificación: <b className="mx-2">{(this.state.users[this.state.username].puntajeTotalUser*100/this.props.estadoJuego.totpreg).toFixed(2)} %</b></div>
                        </div>
            </div>
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
                      {this.state.users.hasOwnProperty("admin") ?
                          Object.keys(this.state.users).map((el, keyUs)=>{
                              return <ResUser key={keyUs}
                                        user={el} 
                                        data={this.state.users[el]}
                                        numPreg={this.props.estadoJuego.totpreg}
                                        detalle={this.handleDetalle}
                                      />
                          })
                      : <tr />
                      }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }else {
        return (
          <div className="container">
            <div className="card bg-dark text-white my-5">
                        <div className="card-header">Resultados del Administrador</div>
                        <div className="card-body">
                            <div>Respuestas correctas: <b className="mx-2">{this.state.users[this.state.username].puntajeTotalUser}</b></div>
                            <div>Total de preguntas: <b className="mx-2">{this.props.estadoJuego.totpreg}</b></div>
                            <div>Calificación: <b className="mx-2">{(this.state.users[this.state.username].puntajeTotalUser*100/this.props.estadoJuego.totpreg).toFixed(2)} %</b></div>
                        </div>
            </div>
            <div className="card bg-dark text-white my-5">
              <div className="card-header">Detalle de Respuestas del Usuario: <b className="mx-2">{this.state.detalle}</b></div>
              <div className="card-body">
                <button className="btn btn-block btn-outline-info" onClick={this.handleLimpiarDetalle}>Regresar a Listado de Usuarios</button>
                {this.props.questions.map((val, idx) => {
                                      return <div key={idx} className="my-3 card bg-dark">
                                      <div className="card-header"> <b>{idx+1}) {val['question']}</b></div>
                                      <div className="card-body">
                                          <OpcionesResultados
                                              nq = {idx}
                                              opciones={val['options']}
                                              ans={this.state.users[this.state.detalle].respuestas[idx]} 
                                              correctAns ={this.props.correctAns[idx]}
                                          />
                                      </div>
                                      </div>
                                  })}
            </div>
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
          <DetalleRespuestas 
                user={this.state.detalle} 
                res={this.state.results[this.state.detalle]} 
                ans={this.state.answers[this.state.detalle]} 
                questions={this.props.questions}
                correctAns ={this.props.correctAns}
              />
*/