import React, {Component} from 'react';
import {render} from 'react-dom';
import User from './User';
import Options from './Options'
import Estadisticas from './Estadisticas'
import Footer from './Footer'
import ResultadosTotales from './ResultadosTotales'
import ResultadosPersonales from './ResultadosPersonales'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';

import io from 'socket.io-client';
//TODO Futuro: ver como agregar base de datos y deploy
//Arreglar como se ven las preguntas cuando aun no se liberan las respuestas y tambien como se envian las respuestas al iniciar sesion
class App extends Component {
    constructor() {
        super();
        this.state = {
            admin: false,
            myId: '',
            username: '',
            password: '',
            userOk: false,
            gameBegins: false,
            gameOver: false,
            answers: {},
            results: {},
            questions: [],
            correctAns: [],
            passwords: {},
            liberarDetalle: false
        }
        this.handleUserOk = this.handleUserOk.bind(this);
        this.handleUserOver = this.handleUserOver.bind(this);
        this.handleUser = this.handleUser.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handleBeginGame = this.handleBeginGame.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
        this.handleReboot = this.handleReboot.bind(this);
        this.handleSaveQuestion = this.handleSaveQuestion.bind(this);
        this.handleLiberarDetalle = this.handleLiberarDetalle.bind(this);
    }

    componentDidMount() {
        this.socket = io('/');
        this.socket.on('myId', id => {
            this.setState({
                myId: id
            }, ()=>{
                sessionStorage.setItem('myId', id)
                this.socket.emit('isGameBegin', '');
            })
        })
        //datos usuario
        this.socket.on('ImAdmin', () => {
            this.setState({
                admin: true
            })
        })
        this.socket.on('userNotValid', () => {
            this.setState({
                userOk: false
            }, () => {
                sessionStorage.setItem('userOk', this.state.userOk);
                //TODO: cambiar alert por algo mas amigable
                if(this.state.username != ''){
                    alert("Usuario no valido");
                }
            })
        })
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
                    if (JSON.parse(sessionStorage.getItem("question"))){
                        this.setState({
                            questions: JSON.parse(sessionStorage.getItem("question"))
                        })
                    }
                    if(JSON.parse(sessionStorage.getItem('correctAns'))){
                        this.setState({
                            correctAns: JSON.parse(sessionStorage.getItem("question"))
                        })
                    }
                })
            }
        }else{
            sessionStorage.setItem('username', this.state.username);
            sessionStorage.setItem('userOk', this.state.userOk);
            sessionStorage.setItem('password', this.state.password);
        }
        //juego
        this.socket.on('beginGame', isIt => {
            this.setState({
                gameBegins: isIt
            })
        })
        this.socket.on('gameOver', () => {
                this.setState({
                    gameBegins: false,
                    gameOver: true
                })
                //pedir datos de resultados
                this.socket.emit('checkUser', {user: this.state.username, pass: this.state.password});
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
                gameBegins: false,
                gameOver: false,
                answers: {},
                results: {},
                questions: [],
                passwords: {},
                liberarDetalle: false
            })
        })
        //resultados
        this.socket.on('resultados', datos => {
            this.setState({
                answers: datos.ans,
                results: datos.res
            })
        })
        this.socket.on('allQuestion', data => {
            data = data.map((el, idx) => {
                data[idx]['nq'] = idx;
                return data[idx];
            });
           if(data.length > 0){
               this.setState({
                   questions: data
               })
           }
        })
        this.socket.on("adminCorrectAns", data => {
            this.setState({
                correctAns: data
            }, () => {
                sessionStorage.setItem('correctAns', JSON.stringify(data));
            })
        })
        this.socket.on('passwords', users =>{
            this.setState({
                passwords: users
            })
        })
        this.socket.on('detalleLiberado', isTrue =>{
                this.setState({
                    liberarDetalle: isTrue
                })
        })
    } //termina didMount

    handleUser(e) {
        this.setState({
            username: e.target.value
        })
    }
    handleUserOk() {
        if(this.state.username != '' && this.state.password != '' && !this.state.gameOver){
            if(!this.state.userOk){
                this.socket.emit('newUser', {user: this.state.username, pass: this.state.password});
                sessionStorage.setItem('username', this.state.username);
                sessionStorage.setItem('password', this.state.password);
            }else{
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
        if(this.state.gameOver && this.state.username != '' && this.state.password != ''){
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
            password: e.target.value
        })
    }
    handleBeginGame(){
        this.socket.emit('beginGame', {user: this.state.username, pass: this.state.password});
    }
    handleAnswer(answer){
        var ans = {
            id: this.state.username,
            q: answer['q'],
            ans: answer['ans']
        }
        this.socket.emit('answer', ans);
    }
    handleReboot(){
        this.socket.emit('reboot', {user: this.state.username, pass: this.state.password});
    }
    handleSaveQuestion(question){
        if(question.nq == this.state.questions.length){
                this.setState({
                    questions: [...this.state.questions, question]
                }, ()=>{
                    sessionStorage.setItem('question', JSON.stringify(this.state.questions));
                })
        }
    }
    handleLiberarDetalle(){
        this.socket.emit('liberarDetalle', {user: this.state.username, pass: this.state.password})
    }

    render() {
        //boton reiniciar todo
        if(this.state.admin) {
            var btnReboot = <button className="btn btn-outline-danger botonReiniciar" onClick={this.handleReboot}>Reiniciar Todo y Borrar Datos</button>
        }else{
            var btnReboot = '';
        }
        //usuario nav y boton cambiar
        if(this.state.userOk){
            var usuarioDiv = <div className="usuarioOk">
                        <h5 className="usuarioNombre">{this.state.username}</h5>
                        <div className="botonUserDiv mx-3 my-2"><button 
                            onClick={(this.state.gameOver) ? this.handleUserOver : this.handleUserOk} 
                            className="btn btn-outline-secondary"
                        >
                                Cambiar
                        </button></div>
                    </div>
        }else{
            var usuarioDiv = '';
        }
        //boton iniciar partida
        if(this.state.admin && !this.state.gameOver) {
            var btnIniciar = <button onClick={this.handleBeginGame} className="container btn btn-primary my-5 py-3 btn-block">Iniciar Cuestionario</button>
        }else if (!this.state.admin && !this.state.gameOver){
            var btnIniciar = <div className="bg-dark  my-5 py-3 card container text-white">Espere a que el Administrador Inicie el Cuestionario. </div>
        }else {
            var btnIniciar = "";
        }
        if(this.state.gameBegins) {
                return (
                    <div className="container-fluid contenido">
                        <div className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-around">
                            <div className="titulo navbar-text mx-3 my-2">Examen de Adrian</div>
                            {usuarioDiv}
                            <div className="divBtnReiniciar mx-3 my-2">{btnReboot}</div>
                        </div>
                        <div className="main">
                            <Options
                                hans={this.handleAnswer} 
                                userOk={this.state.userOk}
                                gameBegins={this.state.gameBegins}
                                question={this.handleSaveQuestion}
                            />
                        </div>
                        <Estadisticas 
                                ans={this.state.answers} 
                                res={this.state.results} 
                        />
                        <Footer />
                    </div>
                )
        }else {
            return (
                <div className="container-fluid contenido">
                    <div className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-around">
                        <div className="titulo navbar-text mx-3 my-2">Examen de Adrian</div>
                        {usuarioDiv}
                        <div className="divBtnReiniciar mx-3 my-2">{btnReboot}</div>
                    </div>
                    <div className="main">
                        <User
                            userOk={this.state.userOk} 
                            gameOver={this.state.gameOver}
                            username={this.state.username} 
                            password={this.state.password}
                            handleUser={this.handleUser}
                            handleUserOk={this.handleUserOk}
                            handleUserOver={this.handleUserOver}
                            handlePass = {this.handlePass}
                        />
                        {btnIniciar}
                        <ResultadosPersonales 
                            ans={this.state.answers} 
                            res={this.state.results}
                            gameOver={this.state.gameOver}
                            admin={this.state.admin}
                            questions={this.state.questions}
                            correctAns ={this.state.correctAns}
                            user = {this.state.username}
                        />
                        <ResultadosTotales 
                            ans={this.state.answers} 
                            res={this.state.results}
                            gameOver={this.state.gameOver}
                            admin={this.state.admin}
                            questions={this.state.questions}
                            correctAns ={this.state.correctAns}
                            handleLiberarDetalle = {this.handleLiberarDetalle}
                            liberarDetalle = {this.state.liberarDetalle}
                            passwords = {this.state.passwords}
                        />
                    </div>
                    <Estadisticas 
                                ans={this.state.answers} 
                                res={this.state.results} 
                    />
                    <Footer />
                </div>
            )
        }
    }
}

render (
    <App/>,
    document.getElementById('app')
)