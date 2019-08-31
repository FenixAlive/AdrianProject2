import React, { Component } from 'react'

export default class ResultadosPersonales extends Component {
    constructor(){
        var _isMounted = false;
        super();
        this.state = {
            answers: {},
            results: {}
        }
    }
    componentDidMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }   
    //hacer tabla con los resultados del usuario
    render() {
        if(!this.props.admin && this.props.gameOver) {
            return (
                <div id="resPer" className="bg-dark  my-5 py-3">
                    Resultados personales
                </div>
            )
        }else if (!this.props.admin){
            return (
                <div id="resPer" className="bg-dark  my-5 py-3">
                    Espere a que el Administrador Inicie el Cuestionario. 
                </div>
            )
        }else{
            return (
                <React.Fragment />
            )
        }
    }
}