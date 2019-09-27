import React, { Component } from 'react'

export default class Estadisticas extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            estadistica: [],
            numUsers: 0,
            colors: ['bg-primary text-light', 'bg-danger text-light', 'bg-success text-light', 'bg-warning text-black-50', 'bg-secondary text-light', 'bg-info text-light', 'bg-light text-dark', 'bg-dark text-light']
        }
    } 
    componentDidMount() {
        this.setState({
            users: [],
            estadistica: this.props.estadoJuego.estadisticas,
            numUsers: this.props.estadoJuego.numUsers
        })
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.estadoJuego !== prevState.estadoJuego) {
            var users = [];
            return {
                estadistica: nextProps.estadoJuego.estadisticas,
                numUsers: nextProps.estadoJuego.numUsers
            }
        }else {
            return null;
        }
    }
//hacer una grafica con las estadisticas
//{(this.state.numUsers-1 === idx) ? el : el+", "}
    render() {
        if(this.state.estadistica && this.state.numUsers > 0){
            var titulo;
            var estadistica;
        }else{
            var titulo;
            var estadistica;
        }
        if(this.state.numUsers > 0 && this.state.estadistica){
            return (
                <div className="container">
                    <div className="card estadistica">
                        <h5 className="card-header">Estadisticas</h5>
                        <div className="card-body">
                            <div className="card my-3">
                                <h6 className="card-header">Resultados Globales</h6>
                                <div className="card-body">
                                    <div>(Pregunta)) (Respuestas correctas) / (Total de Usuarios) = (porcentaje de aciertos)</div>
                                    {this.state.estadistica.map( (el, idx) => {
                                        return <div key={idx} className="my-3">
                                        {idx+1}) {el} / {this.state.numUsers} = {(el*100/this.state.numUsers).toFixed(2)} %
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return null;
        }
    }
}
                        /*
                        <div className="card my-3">
                            <h6 className="card-header">Usuarios Registrados</h6>
                            <div className="card-body my-2">
                                {this.state.users.map( (el, idx) => {
                                    return <span key={idx} className={this.state.colors[Math.floor(Math.random()*7)]+" userEsta"}>
                                        {el}
                                    </span>
                                })}
                            </div>
                        </div>
                        */
