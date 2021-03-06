import React, { Component } from "react";
import ResUser from "./ResUser";
import OpcionesResultados from './OpcionesResultados'
import { CSVLink, CSVDownload } from "react-csv";
import { relativeTimeThreshold } from "moment";

export default class ResultadosTotales extends Component {
  constructor(props) {
    var _isMounted = false;
    super(props);
    this.state = {
      detalle: '',
      users: {},
      username: '',
      csvData: [['Usuario', 'Contraseña', 'Preguntas Correctas', 'Total de Preguntas', 'Porcentaje Calificación']]
    };
    this.handleDetalle = this.handleDetalle.bind(this);
    this.handleLimpiarDetalle = this.handleLimpiarDetalle.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    if(this._isMounted) {
      if(this.props.datosUsuarios){
        var csvData = [['Usuario', 'Contraseña', 'Preguntas Correctas', 'Total de Preguntas', 'Porcentaje Calificación']];
        Object.keys(this.props.datosUsuarios).map((key,value)=>{
          csvData.push([key, this.props.datosUsuarios[key].pass, this.props.datosUsuarios[key].puntajeTotalUser, this.props.estadoJuego.totpreg,(this.props.datosUsuarios[key].puntajeTotalUser*100/this.props.estadoJuego.totpreg).toFixed(2)]);
        })
      }
        this.setState({
            users: this.props.datosUsuarios,
            username: this.props.user,
            csvData
        })
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.datosUsuarios !== prevState.datosUsuarios) {
        if(nextProps.datosUsuarios && nextProps.admin){
          var csvData = [['Usuario', 'Contraseña', 'Preguntas Correctas', 'Total de Preguntas', 'Porcentaje Calificación']];
          Object.keys(nextProps.datosUsuarios).map((key,value)=>{
            csvData.push([key, nextProps.datosUsuarios[key].pass, nextProps.datosUsuarios[key].puntajeTotalUser, nextProps.estadoJuego.totpreg,(nextProps.datosUsuarios[key].puntajeTotalUser*100/nextProps.estadoJuego.totpreg).toFixed(2)]);
          })
            return {
                users: nextProps.datosUsuarios,
                username: nextProps.user,
                csvData
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
            <div className="container">
                <CSVLink 
                  data={this.state.csvData}
                  filename={"ResultadosAi.csv"}
                >
                  <button className="btn btn-outline-info btn-block">
                    Decargar Resultados Generales en CSV
                  </button>
                </CSVLink>
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
   const csvData = [
      ["firstname", "lastname", "email"],
      ["Ahmed", "Tomi", "ah@smthing.co.com"],
      ["Raed", "Labes", "rl@smthing.co.com"],
      ["Yezzi", "Min l3b", "ymin@cocococo.com"]
    ];
    */