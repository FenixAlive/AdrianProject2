import React, { Component } from 'react'
import io from 'socket.io-client';
import Time from './Time'

//TODO hay un error
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
                }, () =>{
                    sessionStorage.setItem('stateQuestion', JSON.stringify(this.state));
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
                }, () => {
                    sessionStorage.setItem('stateQuestion', JSON.stringify(this.state));
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
                }, () => {
                    sessionStorage.setItem('stateQuestion', JSON.stringify(this.state));
                })
            }
        })
        if(!this.state.gameOver && this.state.question == '' && sessionStorage.getItem('stateQuestion')){
            var sq = JSON.parse(sessionStorage.getItem('stateQuestion'));
            this.setState({
                nq: sq.nq,
                question: sq.question,
                options: sq.options,
                answer: sq.answer,
                answered: sq.answered,
            })
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }    

    handleReboot(){        
        this.props.reboot()
    }
    handleOpc(option) {
        this.setState({
            answered: true,
            answer: option
        }, ()=>{
            sessionStorage.setItem('stateQuestion', JSON.stringify(this.state));
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
            var btnReboot = <button className="btn reboot" onClick={this.handleReboot}>Reiniciar y Borrar Datos</button>
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
        if(this.state.gameOver){
            var qGameOver = <button className="btn btnGameOver" onClick={this.handleGameOver}>¿Iniciar nuevamente !!quitar al terminar?</button>
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
                    <div className="sorry"> Lo siento, llegaste tarde ...</div>
                    {qGameOver}
                </React.Fragment>
            )
        }
    }
}
