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
                <div className="card bg-dark text-white my-5"> 
                    <div className="card-header">
                        Resultados Totales
                    </div>
                    <div className="card-body">
                        solo Adminsitrador los ve
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
