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
        if(this.props.password == '') {
            var passError = <div id="userError" className="alert bg-danger text-white my-4">La contraseña no puede estar vacia</div>;
        }else{
            var passError;
        }
        if(!this.props.userOk) {
            return (
                <div id="user" className="container">
                    <div className="tituloUser">{(this.props.gameOver ) ? "" : "Registra nuevos datos o " }Inicia Sesión</div>
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
                        {passError}
                        <div id="userWarning" className="alert bg-info my-4 text-white">Recuerde sus datos, despues del cuestionario no podrá recuperarlos, no hay distinción entre mayusculas y minusculas</div>
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
