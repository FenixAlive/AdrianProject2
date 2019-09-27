import React, { Component } from 'react'
import OpcionesResultados from './OpcionesResultados'

export default class DetalleRespuestas extends Component {
    constructor(props){
        var _isMounted = false;
        super(props);
        this.state = {
            answers: [],
            results: [],
            numAns: 0,
            total: 0
        }
    }
    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted) {
            this.setState({
                answers: this.props.ans,
                results: this.props.res
            })
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.res !== prevState.results) {
            if(nextProps.res){
                var sumaTotal = 0;
                let lenRes = nextProps.res.length;
                for(let i = 0; i < lenRes; i++){
                    sumaTotal += nextProps.res[i];
                }
                return {
                    answers: nextProps.ans,
                    results: nextProps.res,
                    numAns: lenRes,
                    total: sumaTotal
                }
            }
        }
            return null;
    }
    render() {
        return (
            <React.Fragment>
                {this.props.questions.map((val, idx) => {
                    var usAns;
                    if(this.state.answers){
                        if(this.state.answers.hasOwnProperty(idx)){
                            usAns = this.state.answers[idx];
                        }
                    }
                    return <div key={idx} className="my-3 card bg-dark">
                    <div className="card-header"> <b>{idx+1}) {val['question']}</b></div>
                    <div className="card-body">
                        <OpcionesResultados
                            nq = {idx}
                            opciones={val['options']}
                            ans={usAns} 
                            correctAns ={this.props.correctAns[idx]}
                        />
                    </div>
                    </div>
                })}
            </React.Fragment>
        )
    }
}
/*
{this.props.res.map((item, idx)=>{
                    total += item;
                    numPreg ++;
                    return (<td key={idx}>
                                    <span className="opcResUser">{this.props.ans.hasOwnProperty(idx) ? this.props.ans[idx]+" ) " : "nada ) "}</span>
                                    <span className={item ? "text-success itemResUser py-2 px-1" : "text-danger itemResUser py-2 px-1"}>
                                        <FontAwesomeIcon icon={item ? faCheck : faTimes} />
                                    </span>
                            </td>)
                })}
*/
