import React, { Component } from 'react'
import io from 'socket.io-client';

export default class Estadisticas extends Component {
    constructor() {
        var _isMounted = false;
        super();
        this.state = {
            answers: {},
            results: {}
        }
    }
    componentDidMount() {
        this._isMounted = true;
        this.socket = io('/');
        this.socket.on('resultados', datos => {
            if(this._isMounted){
                this.setState({
                    answers: datos.ans,
                    results: datos.res
                })
                console.log(this.state)
            }

        })
        this.socket.on('reboot', () => {
            if(this._isMounted){
                this.setState({
                    answers: {},
                    results: {}
                })
            }
        })
    }
    componentWillUnmount() {
        this._isMounted = false;
    }    

    render() {
        return (
            <div id="estadistica">
                <div>Estadisticas</div>
                <br />
            </div>
        )
    }
}
