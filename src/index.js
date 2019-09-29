import React, {Component} from 'react';
import {render} from 'react-dom';
import User from './User';
import Questions from './Questions'
import Estadisticas from './Estadisticas'
import Footer from './Footer'
import ResultadosTotales from './ResultadosTotales'
import ResultadosPersonales from './ResultadosPersonales'
import Modal from './Modal'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';

import io from 'socket.io-client';
//TODO Futuro: ver como agregar base de datos y deploy
class App extends Component {
    constructor() {
        super();
        this.state = {
            admin: false,
            myId: '',
            username: '',
            password: '',
            userOk: false,
            answers: [], 
            questions: [],
            correctAns: [],
            modal: false,
            modalData: {},
            estadoJuego: {},
            datosUsuarios: {},
            miResultado: {},
        }
        this.handleUserOk = this.handleUserOk.bind(this);
        this.handleUserOver = this.handleUserOver.bind(this);
        this.handleUser = this.handleUser.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handleBeginGame = this.handleBeginGame.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
        this.handleReboot = this.handleReboot.bind(this);
        this.handleLiberarDetalle = this.handleLiberarDetalle.bind(this);
        this.handleModal = this.handleModal.bind(this);
        this.handleTermine = this.handleTermine.bind(this);
    }

    componentDidMount() {
        this.socket = io('/');
        this.socket.on('myId', id => {
            this.setState({
                myId: id
            }, ()=>{
                sessionStorage.setItem('myId', id)
                if(this.state.username !== '' && this.state.password !== '' && this.state.userOk){
                    //cuando se reinicia el servidor y no se actualiza el navegador
                    this.socket.emit('newUser', {user: this.state.username, pass: this.state.password});
                }
            })
        })
        //datos usuario
        this.socket.on('ImAdmin', () => {
            this.setState({
                admin: true
            })
        })
        this.socket.on('userNotValid', error => {
            this.setState({
                userOk: false
            }, () => {
                sessionStorage.setItem('userOk', this.state.userOk);
                //TODO: cambiar alert por algo mas amigable
                if(this.state.username != ''){
                    alert(error.error);
                }
            })
        })
        this.socket.on('reboot', () => {
            sessionStorage.setItem('question', "[]");
            sessionStorage.setItem('correctAns', "[]");
            if(this.state.username !== '' && this.state.password !== '' && this.state.userOk){
                this.socket.emit('newUser', {user: this.state.username, pass: this.state.password});
            }else{
                this.setState({
                    userOk: false,
                })
            }
            this.setState({
                answers: [], 
                questions: [],
                correctAns: [],
                modal: false,
                modalData: {},
                estadoJuego: {},
                datosUsuarios: {},
                miResultado: {},
            })
        })
        //resultados

        this.socket.on("adminCorrectAns", data => {
            this.setState({
                correctAns: data
            }, () => {
                sessionStorage.setItem('correctAns', JSON.stringify(data));
            })
        })
        this.socket.on('estadoJuego', estadoJuego=>{
            this.setState({
                estadoJuego
            })
            if(this.state.admin){
                this.socket.emit('adminEstado', {user: this.state.username, pass: this.state.password});
            }
        });
        this.socket.on('misResultados', miResultado=>{
            this.setState({
                miResultado: miResultado
            }, () => {
            })
        });
        this.socket.on('usuarios', datosUsuarios=>{
            this.setState({
                datosUsuarios
            })
        })
        this.socket.on('allQuestion', data => {
           if(data.length > 0){
               this.setState({
                   questions: data
               })
           }
        })
        //sessionStorage y state
        if(this.state.username == '' || this.state.password == ''){
            if(sessionStorage.getItem('username') && sessionStorage.getItem('password') && sessionStorage.getItem('userOk')){
                this.setState({
                    username: sessionStorage.getItem('username'),
                    password: sessionStorage.getItem('password'),
                    userOk: JSON.parse(sessionStorage.getItem('userOk'))
                }, () => {
                    if (JSON.parse(sessionStorage.getItem('userOk'))){
                        this.socket.emit('newUser', {user: this.state.username, pass: this.state.password});
                    }
                })
            }
        }else{
            sessionStorage.setItem('username', this.state.username);
            sessionStorage.setItem('userOk', this.state.userOk);
            sessionStorage.setItem('password', this.state.password);
        }
    } //termina DidMount

    handleUser(e) {
        this.setState({
            username: e.target.value.toLowerCase()
        })
    }
    handleUserOk() {
        if(this.state.username != '' && this.state.password != '' && !this.state.estadoJuego.gameEnd){
            if(!this.state.userOk){
                this.socket.emit('newUser', {user: this.state.username, pass: this.state.password});
                sessionStorage.setItem('username', this.state.username);
                sessionStorage.setItem('password', this.state.password);
            }else if(!this.state.miResultado.termino){
                this.socket.emit('deleteUser', {user: this.state.username, pass: this.state.password});
            }
            this.setState({
                userOk: !this.state.userOk,
                admin: false
            },()=>{
                sessionStorage.setItem('userOk', this.state.userOk);
            })
        }
    }
    handleUserOver(){
        if(this.state.estadoJuego.gameEnd && this.state.username != '' && this.state.password != ''){
            if(!this.state.userOk){
                this.setState({
                    admin: false
                }, () => {
                    this.socket.emit('checkUser', {user: this.state.username, pass: this.state.password});
                    sessionStorage.setItem('username', this.state.username);
                    sessionStorage.setItem('password', this.state.password);
                })
            }
            this.setState({
                userOk: !this.state.userOk
            },()=>{
                sessionStorage.setItem('userOk', this.state.userOk);
            })
        }
    }
    handlePass(e) {
        this.setState({
            password: e.target.value.toLowerCase()
        })
    }
    handleBeginGame(){
        this.socket.emit('iniciarCuestionario', {user: this.state.username, pass: this.state.password});
        document.getElementById("iniciarBtn").classList.add("borrarBtn", "disabled");
    }
    handleAnswer(answer){
        var temporal = [];
        for(let i=0; i<this.state.estadoJuego.totpreg; i++){
            temporal[i] = this.state.answers[i];
        }
        temporal[answer.q-1] = answer.ans;
        //agregar answer al state
        this.setState({
                answers: temporal,
        }, ()=>{
        })
    }
    handleReboot(){
        this.socket.emit('reboot', {user: this.state.username, pass: this.state.password});
    }
    handleLiberarDetalle(){
        this.socket.emit('liberarDetalle', {user: this.state.username, pass: this.state.password})
    }
    handleModal(){
        console.log("Modal")
    }
    handleTermine(){
        this.socket.emit('termine', {usuario: {user: this.state.username, pass: this.state.password}, res: this.state.answers})
    }
    render() {
        //boton reiniciar todo
        if(this.state.admin) {
            var btnReboot = <button className="btn btn-outline-danger botonReiniciar" onClick={this.handleReboot}>Reiniciar Todo y Borrar Datos</button>
        }else{
            var btnReboot = '';
        }
        //btn iniciar
        var btnIniciar;
        if(!this.state.estadoJuego.gameBegin && !this.state.estadoJuego.gameEnd){
            btnIniciar =  <div className="bg-dark  my-5 py-3 card container text-white">El cuestionario comienza el 05 de Octubre a las 00:00 horas </div>
        }
        //usuario nav y boton cambiar
        if(this.state.userOk){
            var usuarioDiv = <div className="usuarioOk">
                        <h5 className="usuarioNombre">{this.state.username}</h5>
                        <div className="botonUserDiv mx-3 my-2"><button 
                            onClick={(this.state.estadoJuego.gameEnd) ? this.handleUserOver : this.handleUserOk} 
                            className="btn btn-outline-secondary"
                        >
                                Cambiar
                        </button></div>
                    </div>
        }else{
            var usuarioDiv = '';
        }
        //Main de acuerdo a si ya terminaste el examen o no
        if(this.state.estadoJuego.gameBegin && !this.state.miResultado.termino && this.state.userOk && !this.state.estadoJuego.gameEnd) {
            var main = <div className="main">
                <Questions
                    hans={this.handleAnswer} 
                    estadoJuego={this.state.estadoJuego}
                    questions={this.state.questions}
                    answers={this.state.answers}
                    hanTermine={this.handleTermine}
                />
            </div>
        }else {
            var main = <div className="main">
            <User
                userOk={this.state.userOk} 
                gameOver={this.state.estadoJuego.gameEnd}
                username={this.state.username} 
                password={this.state.password}
                handleUser={this.handleUser}
                handleUserOk={this.handleUserOk}
                handleUserOver={this.handleUserOver}
                handlePass = {this.handlePass}
            />
            {btnIniciar}
            <ResultadosTotales 
                userOk={this.state.userOk} 
                datosUsuarios = {this.state.datosUsuarios}
                admin={this.state.admin}
                user = {this.state.username}
                questions={this.state.questions}
                correctAns ={this.state.correctAns}
                handleLiberarDetalle = {this.handleLiberarDetalle}
                estadoJuego={this.state.estadoJuego}
            />
            <ResultadosPersonales
                userOk={this.state.userOk} 
                miResultado = {this.state.miResultado}
                admin={this.state.admin}
                questions={this.state.questions}
                correctAns ={this.state.correctAns}
                user = {this.state.username}
                estadoJuego={this.state.estadoJuego}
            />
            </div>
        }
        return (
            <div className="container-fluid contenido">
                <div className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-around">
                    <div className="titulo navbar-text mx-3 my-2">Ai</div>
                    {usuarioDiv}
                    <div className="divBtnReiniciar mx-3 my-2">{btnReboot}</div>
                </div>
                {main}
                <Modal 
                    modalOpen={this.state.modal}
                    modalData={this.state.modalData}
                    />
                <Footer />
            </div>
        )
    }
}

render (
    <App/>,
    document.getElementById('app')
)

/*
<Estadisticas 
                    estadoJuego={this.state.estadoJuego}
                />
                */

/*
//boton iniciar partida
if(this.state.admin && !this.state.estadoJuego.gameBegin && !this.state.estadoJuego.gameEnd && this.state.userOk) {
    var btnIniciar = <button onClick={this.handleBeginGame} className="container btn btn-outline-primary my-5 py-3 btn-block" id="iniciarBtn">Iniciar Cuestionario</button>
}else if (!this.state.admin && !this.state.estadoJuego.gameBegin && !this.state.estadoJuego.gameEnd && this.state.userOk){
    var btnIniciar = <div className="bg-dark  my-5 py-3 card container text-white">Espere a que el Administrador Inicie el Cuestionario. </div>
}else {
    var btnIniciar = "";
}

//abajo de user
    {btnIniciar}
*/