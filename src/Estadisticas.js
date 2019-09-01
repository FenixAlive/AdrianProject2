import React, { Component } from 'react'

export default class Estadisticas extends Component {
    constructor() {
        super();
        this.state = {
            answers: {},
            results: {},
            users: [],
            total: [],
            numUsers: 0,
            colors: ['bg-primary text-light', 'bg-danger text-light', 'bg-success text-light', 'bg-warning text-black-50', 'bg-secondary text-light', 'bg-info text-light', 'bg-light text-dark', 'bg-dark text-light']
        }
    } 
    componentDidMount() {
        this.setState({
            answers: this.props.ans,
            results: this.props.res,
            users: [],
            total: [],
            numUsers: 0
        })
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.res !== prevState.results) {
            var sumaTotal = [];
            var users = [];
            var numUsers = 0;
            for(let key in nextProps.res){
                users.push(key);
                numUsers ++;
                let lenUser = nextProps.res[key].length;
                let lenTotal = sumaTotal.length;
                for(let i = 0; i < lenUser; i++){
                    if(lenTotal >= i && lenTotal > 0){
                        sumaTotal[i] += nextProps.res[key][i];
                    }else{
                        sumaTotal.push(nextProps.res[key][i]);
                    }
                }
            }
            return {
                answers: nextProps.ans,
                results: nextProps.res,
                total: sumaTotal,
                users: users,
                numUsers: numUsers
            }
        }else {
            return null;
        }
    }
//hacer una grafica con las estadisticas
//{(this.state.numUsers-1 === idx) ? el : el+", "}
    render() {
        return (
                <div className="card estadistica">
                    <h5 className="card-header">Estadisticas</h5>
                    <div className="card-body">
                        <div className="card my-3">
                            <h6 className="card-header">Usuarios</h6>
                            <div className="card-body my-2">
                                {this.state.users.map( (el, idx) => {
                                    return <span key={idx} className={this.state.colors[Math.floor(Math.random()*7)]+" userEsta"}>
                                        {el}
                                    </span>
                                })}
                            </div>
                        </div>
                        <div className="card my-3">
                            <h6 className="card-header">Promedios</h6>
                            <div className="card-body">
                                {this.state.total.map( (el, idx) => {
                                    return <div key={idx} className="my-3">
                                        Pregunta {idx+1}: {el} / {this.state.numUsers} = {(el*100/this.state.numUsers).toFixed(2)} %
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}
