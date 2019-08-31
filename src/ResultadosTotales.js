import React, { Component } from 'react'

export default class ResultadosTotales extends Component {
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
        if(this.props.admin && this.props.gameOver) {
            return (
                <div id="resTot" className="bg-dark  my-5 py-3"> 
                    Resultados Totales, solo Adminsitrador los ve
                </div>
            )
        }else{
            return (
                <React.Fragment />
            )
        }
    }
}
