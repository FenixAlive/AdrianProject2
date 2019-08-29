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
        if(this.props.gameOver){
            this.props.handleUserOver();
        }else{
            this.props.handleUserOk();
        }
    }
    render() {
        //usuario
        if(!this.props.userOk) {
            return (
                <div id="user" className="container">
                    <div className="form-group">
                        <input 
                            type = "text"
                            className="form-control my-3"
                            value = {this.props.username}
                            placeholder = "Nombre de Usuario"
                            onChange={this.hUser}
                        />
                        <input 
                            type = "password"
                            className="form-control my-3"
                            value = {this.props.password}
                            placeholder = "Contraseña"
                            onChange={this.hPass}
                            required
                        />
                        <button onClick={this.hUserOk} className="btn btn-outline-success btn-block">Enviar</button>
                    </div>
                </div>
            )
        }else {
            return (
                <React.Fragment />
            )
        }
    }
}
