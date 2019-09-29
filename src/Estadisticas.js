import React, { Component } from 'react'
import Chart from './Chart'

export default class Estadisticas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            estadistica: [],
            porcentaje: [],
            global: 0,
            numUsers: 0,
            colors: ['bg-primary text-light', 'bg-danger text-light', 'bg-success text-light', 'bg-warning text-black-50', 'bg-secondary text-light', 'bg-info text-light', 'bg-light text-dark', 'bg-dark text-light']
        }
    } 
    componentDidMount() {
        var porcentaje = []
        if(this.props.estadoJuego.estadisticas){
            var suma = 0;
            var preguntas = 0;
            var global = 0;
            this.props.estadoJuego.estadisticas.map( (el, idx) => {
                porcentaje[idx] = (el*100/this.props.estadoJuego.numUsers).toFixed(2);
                suma += (el*100/this.props.estadoJuego.numUsers);
                preguntas ++;
            })
            if(suma !== 0 && preguntas !== 0){
                global = (suma/preguntas).toFixed(2);
            }
            this.setState({
                users: [],
                estadistica: this.props.estadoJuego.estadisticas,
                numUsers: this.props.estadoJuego.numUsers,
                porcentaje: porcentaje,
                global: global
            })
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.estadoJuego !== prevState.estadoJuego) {
                if(nextProps.estadoJuego.estadisticas){
                    var porcentaje = [];
                    var suma = 0;
                    var preguntas = 0;
                    var global = 0;
                    nextProps.estadoJuego.estadisticas.map( (el, idx) => {
                        porcentaje[idx] = (el*100/nextProps.estadoJuego.numUsers).toFixed(2);
                        suma += (el*100/nextProps.estadoJuego.numUsers);
                        preguntas ++;
                    })
                    if(suma !== 0 && preguntas !== 0){
                        global = (suma/preguntas).toFixed(2);
                    }
                    var users = [];
                    return {
                        estadistica: nextProps.estadoJuego.estadisticas,
                        numUsers: nextProps.estadoJuego.numUsers,
                        porcentaje: porcentaje,
                        global: global
                    }
                }
        }
        return null;
    }
    render() {
        if(this.state.numUsers > 0 && this.state.estadistica){
            return (
                <div className="container">
                    <div className="card estadistica">
                        <h5 className="card-header">Estadisticas</h5>
                        <div className="card-body">
                            <div className="card my-3">
                                <h6 className="card-header">Resultados Globales</h6>
                                <div className="card-body">
                                    <h5>Total de Usuarios:  <b>{this.state.numUsers}</b> usuarios</h5>
                                    <h5>Promedio General: <b>{this.state.global}</b> %</h5>
                                </div>
                            </div>
                        </div>
                        <div className="">
                        <Chart 
                          estadistica={this.state.porcentaje}
                        />
                    </div>
                    </div>
                </div>
            )
        }else{
            return null;
        }
    }
}
