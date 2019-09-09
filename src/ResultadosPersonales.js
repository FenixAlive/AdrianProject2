import React, { Component } from 'react'
import DetalleRespuestas from "./DetalleRespuestas"

export default class ResultadosPersonales extends Component {
    constructor(props){
        var _isMounted = false;
        super(props);
        this.state = {
            user: '',
            answers: {},
            results: {}
        }
    }
    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted) {
            this.setState({
                user: this.props.user,
                answers: this.props.ans,
                results: this.props.res
            })
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }   
    //hacer tabla con los resultados del usuario
    render() {
        console.log(this.state.answers)
        if(!this.props.admin && this.props.gameOver && this.props.ans) {
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
                <React.Fragment />
            )
        }
    }
}