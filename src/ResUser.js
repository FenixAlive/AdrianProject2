import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

export default class ResUser extends Component {
    render() {
        var total = 0;
        var numPreg = 0;
        return (
            <tr>
                <th key={this.props.user} scope="row">{this.props.user}</th>
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
                <td>{total} de {numPreg} = {(total*100/numPreg).toFixed(2)}%</td>
            </tr>
        )
    }
}
