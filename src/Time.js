import React, { Component } from 'react'


export default class Time extends Component {
    render() {
        if(this.props.nq === 0 && this.props.time === ''){
            return (
                <div>
                </div>
            )
        }else{
            return (
                <div>
                    <div>Pregunta N- {this.props.nq+1}</div>
                    Tiempo para responder pregunta: {this.props.time}
                    <br />
                </div>
            )
        }
        
    }
}
