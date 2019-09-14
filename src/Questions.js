import React, { Component } from 'react'
import Options from './Options'
import Time from "./Time";

export default class Questions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0,
            nq: -1
        }
    }
    componentDidMount(){
        this.setState({
            time: this.props.estadoJuego.gameRest
        })
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.estadoJuego !== prevState.estadoJuego) {
            return {
                time: nextProps.estadoJuego.gameRest
            }
        }
            return null;
    }
    render() {
        //por cada pregunta cambiar el map por una selección de preguntas
        //Poner boton para enviar todas las respuestas
        return (
            <div id="opContainer" className="">
                <Time time={this.state.time} nq={this.state.nq} />
                {this.props.questions.map((val, idx)=>{
                    return <Options
                        key={idx}
                        hans={this.props.handleAnswer} 
                        estadoJuego={this.props.estadoJuego}
                        question={val}
                        termine={this.props.handleTermine}
                    />
                })}
            </div>
        )
    }
}
