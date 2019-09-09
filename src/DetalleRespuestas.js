import React, { Component } from 'react'
import OpcionesResultados from './OpcionesResultados'

export default class DetalleRespuestas extends Component {
    render() {
        return (
            <React.Fragment>
                {this.props.questions.map((val, idx) => {
                    var usAns;
                    if(this.props.ans.hasOwnProperty(idx)){
                        usAns = this.props.ans[idx];
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
