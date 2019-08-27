import React, {Component} from 'react';
import {render} from 'react-dom';
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
            isAdmin: false,
            myId: '',
            username: '',
            userOk: false,
            gameBegins: false
        }
        this.handleAdmin = this.handleAdmin.bind(this);
        this.handleAdminReboot = this.handleAdminReboot.bind(this);
        this.handleUserOk = this.handleUserOk.bind(this);
        this.handleUser = this.handleUser.bind(this);
        this.handleBeginGame = this.handleBeginGame.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
    }

    componentDidMount() {
        this.socket = io('/');
        this.socket.on('myId', id => {
            this.setState({
                myId: id
            }, ()=>{
                if(sessionStorage.getItem('myId') && sessionStorage.getItem('myId') !== ""){
                    this.socket.emit('changeId', sessionStorage.getItem('myId'))  
                }else{
                    this.socket.emit('isAdmin', this.state.admin);
                }
                sessionStorage.setItem('myId', id)
                console.log(id);
                this.socket.emit('isGameBegin', '');
            })
        })
        //datos usuario
        this.socket.on('isAdmin', isAdmin => {
            this.setState({
                isAdmin: isAdmin
            })
        })
        this.socket.on('returnAdmin', isAdmin => {
            this.setState({
                admin: isAdmin
            })
        })
        this.socket.on('rebootAdmin', () => {
            this.setState({
                admin: false,
                isAdmin: false
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
        if(this.state.username == ''){
            if(sessionStorage.getItem('username')){
                this.setState({
                    username: sessionStorage.getItem('username'),
                    userOk: sessionStorage.getItem('userOk')
                })
            }
        }else{
            sessionStorage.setItem('username', this.state.username)
            sessionStorage.setItem('userOk', this.state.userOk);
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

    handleAdmin() {
        var admin = this.state.admin;
        if(admin || !this.state.isAdmin)
        this.setState({
            admin: !admin
        },()=>{
            this.socket.emit('isAdmin', !admin)
        })
    }
    handleAdminReboot() {
        this.socket.emit('rebootAdmin', '');
    }
    handleUser(e) {
        this.setState({
            username: e.target.value
        })
    }
    handleUserOk() {
        if(this.state.username != ''){
            if(!this.state.userOk){
                this.socket.emit('newUser', this.state.username);
                sessionStorage.setItem('username', this.state.username);
            }else{
                this.socket.emit('deleteUser', this.state.username);
            }
            this.setState({
                userOk: !this.state.userOk
            },()=>{
                sessionStorage.setItem('userOk', this.state.userOk);
            })
        }
    }
    handleBeginGame(){
        this.socket.emit('beginGame', this.state.myId);
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
        //adminstrador
        if(this.state.admin && this.state.isAdmin) {
            var btnAdmin = <button onClick={this.handleAdmin}>Dejar Administración</button>
        }else if(this.state.isAdmin){
            var btnAdmin = <button onClick={this.handleAdminReboot}>Cambiar Administrador</button>;
        }else {
            var btnAdmin = <button onClick={this.handleAdmin}>Administrar Partida</button>
        }
        //boton usuario
        if(this.state.userOk) {
            var user = <React.Fragment>
                <div>
                    <span>{this.state.username}</span>
                    <button onClick={this.handleUserOk}>Cambiar</button>
                </div>
                {btnAdmin}
                </React.Fragment>
        }else {
            var user = <div>
                <input 
                    type = "text"
                    value = {this.state.username}
                    placeholder = "Nombre de Usuario"
                    onChange={this.handleUser}
                />
                <button onClick={this.handleUserOk}>Ok</button>
            </div>
        }
        //boton iniciar partida
        if(this.state.admin) {
            var btnIniciar = <button onClick={this.handleBeginGame}>Iniciar Partida</button>
        }else{
            var btnIniciar = '';
        }

        if(this.state.gameBegins) {
                return (
                    <React.Fragment>
                        <Estadisticas />
                        <Options hans={this.handleAnswer} admin={this.state.admin} myId={this.state.myId} userOk={this.state.userOk}/>
                        <footer>FenixRobotics@2019</footer>
                    </React.Fragment>
                )
        }else {
            return (
                <React.Fragment>
                    <Estadisticas />
                    {user}
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