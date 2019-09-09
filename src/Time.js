import React, { Component } from 'react'


export default class Time extends Component {
    render() {
        if(this.props.nq === 0 && this.props.time === ''){
            return (
                <React.Fragment />
            )
        }else{
            return (
                <div className="navbar navbar-dark bg-dark d-flex justify-content-around my-3 py-3">
                    <div>Pregunta N- <b>{this.props.nq+1}</b></div>
                    <div><span className="mx-2">Tiempo: </span><b>{this.props.time}</b></div>
                    <br />
                </div>
            )
        }
        
    }
}
