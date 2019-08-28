import React, { Component } from 'react'

export default class User extends Component {
    constructor(){
        var _isMounted = false;
        super();
        this.hUser = this.hUser.bind(this);
        this.hUserOk = this.hUserOk.bind(this);
        this.hPass = this.hPass.bind(this);
    }
    hUser(e) {
        this.props.handleUser(e);
    }
    hPass(e) {
        this.props.handlePass(e);
    }
    hUserOk() {
        //si la contraseña esta vacia mandar error
        this.props.handleUserOk();
    }
    render() {
        //boton usuario
        if(this.props.userOk) {
            var user = <React.Fragment>
                <div>
                    <span>{this.props.username}</span>
                    <button onClick={this.hUserOk}>Cambiar</button>
                </div>
                </React.Fragment>
        }else {
            var user = <div>
                <input 
                    type = "text"
                    value = {this.props.username}
                    placeholder = "Nombre de Usuario"
                    onChange={this.hUser}
                />
                <input 
                    type = "password"
                    value = {this.props.password}
                    placeholder = "Contraseña"
                    onChange={this.hPass}
                />
                <button onClick={this.hUserOk}>Enviar</button>
            </div>
        }
        return (
            <div id="user">
                {user}
            </div>
        )
    }
}
