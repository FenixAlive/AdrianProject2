import React, { Component } from 'react'
import Options from './Options'
import Time from "./Time";

export default class Questions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0,
            nq: -1,
            error: false
        }
        this.handleTermine = this.handleTermine.bind(this);
        this.handleRegresarAContestar = this.handleRegresarAContestar.bind(this);
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
    handleTermine(){
        var ok = true;
        for(let i=0; i<this.props.estadoJuego.totpreg; i++){
            if(this.props.answers[i] === undefined){
                ok = false;
                this.setState({
                    error: true
                })
                break;
            }
        }
        if(ok){
            this.props.hanTermine();
        }
    }
    handleRegresarAContestar(){
        this.setState({
            error: false
        })
    }
    render() {
        //<Time time={this.state.time} nq={this.state.nq} />
        //por cada pregunta cambiar el map por una selección de preguntas
        if(this.state.error){
            return (
                <div id="opContainer" className="">
                    <div className ="container"> 
                        <h5 className="m-5">No has contestado todas las preguntas</h5>
                        <button className="btn btn-info my-5 py-3 btn-block" onClick={this.handleRegresarAContestar}>Regresar a contestar las faltantes</button>
                        <button className="btn btn-danger my-5 py-3 btn-block" onClick={this.props.hanTermine}>Enviar</button>
                    </div>
                </div>
            )
        }else{
            return (
                <div id="opContainer" className="">
                    <h5 className="m-5">Contesta las siguientes Preguntas dando clic sobre una opción, al terminar da click sobre el boton enviar:</h5>
                    <div className ="container"> <button className="btn btn-primary my-5 py-3 btn-block" onClick={this.handleTermine}>Enviar Respuestas</button></div>
                    {this.props.questions.map((val, idx)=>{
                        return <Options
                            key={idx}
                            hans={this.props.hans} 
                            estadoJuego={this.props.estadoJuego}
                            question={val}
                            answer={this.props.answers[idx]}
                        />
                    })}
                </div>
            )
        }
    }
}
