import React, { Component } from 'react'

export default class Estadisticas extends Component {
    constructor() {
        super();
        this.state = {
            answers: {},
            results: {},
            total: [],
            numUsers: 0
        }
    } 
    componentDidMount() {
        this.setState({
            answers: this.props.ans,
            results: this.props.res,
            total: [],
            numUsers: 0
        })
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.res !== prevState.results) {
            var sumaTotal = [];
            var numUsers = 0;
            for(let key in nextProps.res){
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
                numUsers: numUsers
            }
        }else {
            return null;
        }
    }

    render() {
        return (
            <div id="estadistica" className="container">
                <div>Estadisticas</div>
                {this.state.total.map( (el, idx) => {
                    return <div key={idx}>
                        Pregunta {idx+1}: {el} / {this.state.numUsers} = {(el*100/this.state.numUsers).toFixed(2)} %
                    </div>
                })}
            </div>
        )
    }
}
