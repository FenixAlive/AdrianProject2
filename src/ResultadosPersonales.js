import React, { Component } from 'react'
import OpcionesResultados from './OpcionesResultados'

export default class ResultadosPersonales extends Component {
    constructor(props){
        var _isMounted = false;
        super(props);
        this.state = {
            user: '',
            answers: [],
            results: [],
            detalle: false,
            numAns: 0,
            total: 0,
            //nuevas
            termine: false
        }
    }
    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted) {
            this.setState({
                user: this.props.user,
                answers: this.props.miResultado.respuestas,
                results: this.props.miResultado.puntajePP,
                detalle: this.props.estadoJuego.liberarDetalle,
                numAns: this.props.estadoJuego.totpreg,
                total: this.props.miResultado.puntajeTotalUser,
                termine: this.props.miResultado.termino
            })
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.miResultado !== prevState.miResultado) {
            if(nextProps.miResultado && nextProps.user !== ''){
                return {
                    answers: nextProps.miResultado.respuestas,
                    results: nextProps.miResultado.puntajePP,
                    total: nextProps.miResultado.puntajeTotalUser,
                    termine: nextProps.miResultado.termino
                }
            }
        }
        if(nextProps.estadoJuego !== prevState.estadoJuego){
            if(nextProps.estadoJuego.hasOwnProperty('liberarDetalle')){
                return {
                    detalle: nextProps.estadoJuego.liberarDetalle,
                    numAns: nextProps.estadoJuego.totpreg,
                }
            }
        }
            return null;
    }
    
    //hacer resumen de los resultados
    render() {
        if(!this.props.admin && this.state.termine && this.state.answers) {
            if(this.state.detalle){
                return (
                    <div className="container">
                        <div className="card bg-dark text-white my-5">
                        <div className="card-header">Resultados del Usuario: <b className="mx-2">{this.state.user}</b></div>
                        <div className="card-body">
                            <div>Respuestas correctas: <b className="mx-2">{this.state.total}</b></div>
                            <div>Total de preguntas: <b className="mx-2">{this.state.numAns}</b></div>
                            <div>Calificación: <b className="mx-2">{(this.state.total*100/this.state.numAns).toFixed(2)} %</b></div>
                        </div>
                        </div>
                        <div className="card bg-dark text-white my-5">
                            <div className="card-header">Detalle de Respuestas del Usuario: <b className="mx-2">{this.state.user}</b></div>
                            <div className="card-body">
                                {this.props.questions.map((val, idx) => {
                                    return <div key={idx} className="my-3 card bg-dark">
                                    <div className="card-header"> <b>{idx+1}) {val['question']}</b></div>
                                    <div className="card-body">
                                        <OpcionesResultados
                                            nq = {idx}
                                            opciones={val['options']}
                                            ans={this.state.answers[idx]} 
                                            correctAns ={this.props.correctAns[idx]}
                                        />
                                    </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                )
            }else{
                return (
                    <div className="container">
                        <div className="card bg-dark text-white my-5">
                            <div className="card-header">Resultados del Usuario: <b className="mx-2">{this.state.user}</b></div>
                            <div className="card-body">
                                <div>Respuestas correctas: <b className="mx-2">{this.state.total}</b></div>
                                <div>Total de preguntas: <b className="mx-2">{this.state.numAns}</b></div>
                                <div>Calificación: <b className="mx-2">{(this.state.total*100/this.state.numAns).toFixed(2)} %</b></div>
                                <div className="alert bg-info my-3" >El administrador puede liberar en cualquier momento el detalle de las preguntas y respuestas correctas</div>
                            </div>
                        </div>
                    </div>
                )
            }
        }else{
            return (
                <React.Fragment />
            )
        }
    }
}
/*
<DetalleRespuestas 
                                user={this.state.user} 
                                res={this.state.results}
                                ans={this.state.answers}
                                questions={this.props.questions}
                                correctAns ={this.props.correctAns}
                            />
                            */