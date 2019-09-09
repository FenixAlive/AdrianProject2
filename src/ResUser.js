import React, { Component } from 'react'

export default class ResUser extends Component {
    constructor(props){
        super(props);
        this.state = {
            total: 0,
            numPreg: 0,
            promedio: 0
        }
        this.handleDetalle = this.handleDetalle.bind(this);
    }
    componentDidMount(){
        var total = 0;
        var numPreg = this.props.res.length;
        this.props.res.map((item, idx)=>{
            total += item;
        });
        this.setState({
            total: total,
            numPreg: numPreg,
            promedio: (total*100/numPreg).toFixed(2)
        })

    }
    handleDetalle(){
        this.props.detalle(this.props.user);
    }
    render() {
        return (
            <tr>
                <th key={this.props.user} scope="row">{this.props.user}</th>
                <td>1234</td>
                <td>{this.state.total} de {this.state.numPreg} = {this.state.promedio}%</td>
                <td><button className="btn btn-outline-info" onClick={this.handleDetalle}>Detalle</button>  </td>
            </tr>
            )
    }
}