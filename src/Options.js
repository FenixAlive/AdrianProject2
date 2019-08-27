import React, { Component } from 'react'
import io from 'socket.io-client';
import Time from './Time'


export default class Options extends Component {
    constructor() {
        var _isMounted = false;
        super();
        this.state = {
            time: '',
            nq: 0,
            question: '',
            options: [],
            answer: {opt: '', ans: ''},
            answered: false,
            gameOver: false
        }
        this.handleReboot = this.handleReboot.bind(this);
        this.handleOpc = this.handleOpc.bind(this);
        this.handleGameOver = this.handleGameOver.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.socket = io('/');
        this.socket.emit('isGameOver', '');
        this.socket.on('question', q =>{
            if(this._isMounted){
                var {nq, question, options} = q;
                this.setState({
                    nq,
                    question,
                    options,
                    answer: {opt: '', ans: ''},
                    answered: false
                })
            }
        });
        this.socket.on('time', time => {
            if(this._isMounted){
                this.setState({
                    time: time
                })
            }
        })
        this.socket.on('gameOver', () => {
            if(this._isMounted){
                this.setState({
                    time: '',
                    nq: 0,
                    question: '',
                    options: [],
                    answer: {opt: '', ans: ''},
                    answered: false,
                    gameOver: true
                })
            }
        })
        this.socket.on('reboot', () => {
            if(this._isMounted){
                this.setState({
                    time: '',
                    nq: 0,
                    question: '',
                    options: [],
                    answer: {opt: '', ans: ''},
                    answered: false,
                    gameOver: false
                })
            }
        })
    }
    componentWillUnmount() {
        this._isMounted = false;
    }    

    handleReboot(){        
        this.socket.emit('reboot', this.props.myId);
    }
    handleOpc(option) {
        this.setState({
            answered: true,
            answer: option
        })
        let ans = {
            q: this.state.nq,
            ans: option.opt
        }
        this.props.hans(ans)
    }
    handleGameOver() {
        this.socket.emit('rebootGameOver', '');
    }
    render() {
        //boton reiniciar juego
        if(this.props.admin) {
            var btnReboot = <button className="btn reboot" onClick={this.handleReboot}>Reiniciar Partida</button>
        }else{
            var btnReboot = '';
        }
        //pregunta contestada
        if(this.state.answered){
            var options = <div>Respondiste: <span>{this.state.answer.opt}) </span>  <span>{this.state.answer.ans}</span></div>
        }else{
            var options = <div id="options">
                {this.state.options.map((el, idx) => {
                return <button id={el.opt} key={el.opt} onClick={() => this.handleOpc(el)}>
                            <span>{el.opt}) </span> 
                            <span>{el.ans}</span>
                        </button>
                })}
        </div>
        }
        // preguntar al terminar partida si reiniciar y mostrar calificaciónes
        io.sockets.emit('gameOver', '');
        if(this.state.gameOver){
            var qGameOver = <button className="btn btnGameOver" onClick={this.handleGameOver}>¿Iniciar Nueva Partida?</button>
            if(this.props.userOk){
                var calificacion = <div id="Calificación">Tu calificación: </div>
            }
        }else{
            var qGameOver = '';
        }
        //render return
        if(this.props.userOk) {
            return (
                <React.Fragment>
                    <Time time={this.state.time} nq={this.state.nq}/>
                    <div className="qContainer">
                        <div id="question">Pregunta: {this.state.question}</div>
                        {options}
                        {btnReboot}
                        {qGameOver}
                    </div>
                </React.Fragment>
            )
        }else {
            return (
                <React.Fragment>
                    <Time time={this.state.time} nq={this.state.nq}/>
                    <div className="wait"> Espere a que la partida actual termine</div>
                    {qGameOver}
                </React.Fragment>
            )
        }
    }
}
