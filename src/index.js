import React, {Component} from 'react';
import {render} from 'react-dom';
import User from './User';
import Options from './Options'
import Estadisticas from './Estadisticas'
import './App.css'

import io from 'socket.io-client';
//TODO: ver si poner boton de reinicio desde aqui para reiniciar usuarios cuando se requiera
class App extends Component {
    constructor() {
        super();
        this.state = {
            admin: false,
            myId: '',
            username: '',
            password: '',
            userOk: false,
            gameBegins: false
        }
        this.handleUserOk = this.handleUserOk.bind(this);
        this.handleUser = this.handleUser.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handleBeginGame = this.handleBeginGame.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
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
                alert("Usuario no valido, buscar otro");
            })
        })
        if(this.state.username == '' || this.state.password == ''){
            if(sessionStorage.getItem('username') && sessionStorage.getItem('password') && sessionStorage.getItem('userOk')){
                this.setState({
                    username: sessionStorage.getItem('username'),
                    password: sessionStorage.getItem('password'),
                    userOk: sessionStorage.getItem('userOk')
                }, () => {
                    this.socket.emit('amIAdmin', {user: this.state.username, pass: this.state.password});
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
        this.socket.on('reboot', () => {
            if(this.state.username !== '' && this.state.userOk){
                this.socket.emit('newUser', this.state.username);
            }
            this.setState({
                gameBegins: false,
            })
        })
    } //termina didMount

    handleUser(e) {
        this.setState({
            username: e.target.value
        })
    }
    handleUserOk() {
        if(this.state.username != '' && this.state.password != ''){
            if(!this.state.userOk){
                this.socket.emit('newUser', {user: this.state.username, pass: this.state.password});
                sessionStorage.setItem('username', this.state.username);
                sessionStorage.setItem('password', this.state.password);
            }else{
                this.socket.emit('deleteUser', {user: this.state.username, pass: this.state.password});
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

    render() {
        //boton iniciar partida
        if(this.state.admin) {
            var btnIniciar = <button onClick={this.handleBeginGame}>Iniciar Cuestionario</button>
        }else{
            var btnIniciar = '';
        }
        if(this.state.gameBegins) {
                return (
                    <React.Fragment>
                        <Estadisticas />
                        <Options hans={this.handleAnswer} 
                            admin={this.state.admin} 
                            myId={this.state.myId} 
                            userOk={this.state.userOk}
                        />
                        <footer>FenixRobotics@2019</footer>
                    </React.Fragment>
                )
        }else {
            return (
                <React.Fragment>
                    <Estadisticas />
                    <User userOk={this.state.userOk} 
                        username={this.state.username} 
                        password={this.state.password}
                        handleUser={this.handleUser}
                        handleUserOk={this.handleUserOk}
                        handlePass = {this.handlePass}
                    />
                    {btnIniciar}
                    <footer>FenixRobotics@2019</footer>
                </React.Fragment>
            )
        }
    }
}

render (
    <App/>,
    document.getElementById('app')
)