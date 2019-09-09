import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

export default class OpcionesResultados extends Component {
    render() {
        return (
            <div>
                <div className={"userEsta "+(this.props.correctAns == this.props.ans ? "text-success" : "text-danger")}>
                    <div>Respuesta correcta: <b>{this.props.correctAns}</b> </div>
                    <div>Contesto: <b>{this.props.ans ? this.props.ans : "No contesto"}</b></div>
                    <h3><FontAwesomeIcon icon={this.props.correctAns == this.props.ans ? faCheck : faTimes} /></h3>
                </div>
                {this.props.opciones.map((val,idx)=>{ 
                    if(this.props.correctAns == val['opt'] && val['opt'] == this.props.ans) {
                        var color = 'bg-success';
                    }else if(this.props.correctAns == val['opt']) {
                        var color = 'bg-primary';
                    }else if(val['opt'] == this.props.ans) {
                        var color = 'bg-danger';
                    }else{
                        var color = 'bg-secondary'
                    }
                    return <div key={idx} className={"card-body my-2 "+color}>
                <span>{val['opt']+") "}</span> <span>{val['ans']}</span>
                            </div>})}
            </div>
        )
    }
}
