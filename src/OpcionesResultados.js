import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

export default class OpcionesResultados extends Component {
    constructor(props){
        var _isMounted = false;
        super(props);
        this.state = {
            nq: -1,
            opciones: [],
            answer: undefined,
            correctAns: 'x'
        }
    }
    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted) {
            
            this.setState({
                nq: this.props.nq,
                opciones: this.props.opciones,
                answer: this.props.ans ? this.props.ans['opt'] : null,
                correctAns: this.props.correctAns
            })
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps !== prevState) {
            return {
                nq: nextProps.nq,
                opciones: nextProps.opciones,
                answer: nextProps.ans ? nextProps.ans['opt'] : null,
                correctAns: nextProps.correctAns
            }
        }
        return null;
    }
    render() {
        return (
            <div>
                <div className={"userEsta "+(this.state.correctAns == this.state.answer ? "text-success" : "text-danger")}>
                    <div className="contRes">
                        <div>Respuesta correcta: <b>{this.state.correctAns}</b> </div>
                        <div>Contesto: <b>{this.state.answer ? this.state.answer : "No contesto"}</b></div>
                    </div>
                    <h3 className="palomita">
                        <FontAwesomeIcon icon={this.state.correctAns == this.state.answer ? faCheck : faTimes} />
                    </h3>
                </div>
                {this.state.opciones.map((val,idx)=>{ 
                    if(this.state.correctAns == val['opt'] && val['opt'] == this.state.answer) {
                        var color = 'bg-success';
                    }else if(this.state.correctAns == val['opt']) {
                        var color = 'bg-primary';
                    }else if(val['opt'] == this.state.answer) {
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
