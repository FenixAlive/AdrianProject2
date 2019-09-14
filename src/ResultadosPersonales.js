import React, { Component } from 'react'
import DetalleRespuestas from "./DetalleRespuestas"

export default class ResultadosPersonales extends Component {
    constructor(props){
        var _isMounted = false;
        super(props);
        this.state = {
            user: '',
            answers: {},
            results: {},
            detalle: false,
            numAns: 0,
            total: 0
        }
    }
    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted) {
            this.setState({
                user: this.props.user,
                answers: this.props.ans,
                results: this.props.res,
                detalle: this.props.detalle
            })
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if(nextProps.res !== prevState.res) {
            if(nextProps.res && nextProps.user !== '' && nextProps.res.hasOwnProperty(nextProps.user)){
                var sumaTotal = 0;
                let lenRes = nextProps.res[nextProps.user].length;
                for(let i = 0; i < lenRes; i++){
                    sumaTotal += nextProps.res[nextProps.user][i];
                }
                return {
                    answers: nextProps.ans,
                    results: nextProps.res,
                    numAns: lenRes,
                    total: sumaTotal
                }
            }
        }
        if(nextProps.detalle !== prevState.detalle){
            return {
                detalle: nextProps.detalle
            }
        }
            return null;
    }
    
    //hacer resumen de los resultados
    render() {
        if(!this.props.admin && this.props.gameOver && this.props.ans) {
            if(this.state.detalle){
                return (
                    <div className="card bg-dark text-white my-5">
                        <div className="card-header">Detalle de Respuestas del Usuario: <b className="mx-2">{this.state.user}</b></div>
                        <div className="card-body">
                        <DetalleRespuestas 
                            user={this.state.user} 
                            res={this.state.results[this.state.user]}
                            ans={this.state.answers[this.state.user]}
                            questions={this.props.questions}
                            correctAns ={this.props.correctAns}
                        />
                        </div>
                    </div>
                )
            }else{
                return (
                    <div className="card bg-dark text-white my-5">
                        <div className="card-header">Resultados del Usuario: <b className="mx-2">{this.state.user}</b></div>
                        <div className="card-body">
                            <div>Respuestas correctas: <b className="mx-2">{this.state.total}</b></div>
                            <div>Total de preguntas: <b className="mx-2">{this.state.numAns}</b></div>
                            <div>Calificación: <b className="mx-2">{(this.state.total*100/this.state.numAns).toFixed(2)} %</b></div>
                            <div className="alert bg-info my-3" >El administrador puede liberar en cualquier momento el detalle de las preguntas y respuestas correctas</div>
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