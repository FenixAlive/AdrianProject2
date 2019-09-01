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
                <div className="bg-dark  text-white my-5 py-3 card">
                    Resultados personales
                </div>
            )
        }else{
            return (
                <React.Fragment />
            )
        }
    }
}