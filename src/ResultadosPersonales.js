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
    render() {
        if(!this.props.admin && this.props.gameOver) {
            return (
                <div>
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