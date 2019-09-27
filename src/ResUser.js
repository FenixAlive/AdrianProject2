import React, { Component } from 'react'

export default class ResUser extends Component {
    constructor(props){
        super(props);
        this.handleDetalle = this.handleDetalle.bind(this);
    }
    handleDetalle(){
        this.props.detalle(this.props.user);
    }
    render() {
        return (
            <tr>
                <th key={this.props.user} scope="row">{this.props.user}</th>
                <td>{this.props.data.pass}</td>
                <td>{this.props.data.puntajeTotalUser} de {this.props.numPreg} = {(this.props.data.puntajeTotalUser*100/this.props.numPreg).toFixed(2)} %</td>
                <td><button className="btn btn-outline-info" onClick={this.handleDetalle}>Detalle</button>  </td>
            </tr>
            )
    }
}