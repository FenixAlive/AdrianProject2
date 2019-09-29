import React, { Component } from 'react'
import {Bar, Line, Pie} from 'react-chartjs-2';

export default class Chart extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: {
                labels: ['Pregunta 1','Pregunta 2','Pregunta 3','Pregunta 4','Pregunta 5'],
                datasets: [
                    {
                        label: 'Porcentaje por pregunta',
                        data: [
                            10,
                            50,
                            80,
                            70,
                            100
                        ],
                        backgroundColor: [
                            'rgba(30, 250, 250, 0.5)',
                            'rgba(90, 130, 200, 0.5)',
                            'rgba(180, 90, 90, 0.5)',
                            'rgba(250, 30, 250, 0.5)',
                            'rgba(180, 180, 0, 0.5)'
                        ]
                    }
                ],
            },
            options: {
                type: 'horizontalBar',
                maintainAspectRatio: true,
                title: {
                    display: true,
                    text: 'Porcentaje Total de Aciertos por Pregunta',
                },
                legend:{
                    display: false,
                    position: 'right'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 100,
                            beginAtZero: true
                        }
                    }]
                }

            }
        }
    }
    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted) {
            console.log(this.props.estadistica)

            this.setState(state =>{
                state.data.datasets.data = this.props.estadistica
                return {data: state}
            })
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.estadistica !== prevState.estadistica) {
                return {data: {
                    labels: ['Pregunta 1','Pregunta 2','Pregunta 3','Pregunta 4','Pregunta 5'],
                    datasets: [
                        {
                            label: 'Porcentaje por pregunta',
                            data: nextProps.estadistica,
                            backgroundColor: [
                                'rgba(191, 63, 127, 0.7)',
                                'rgba(63, 191, 63, 0.7)',
                                'rgba(191, 63, 63, 0.7)',
                                'rgba(63, 191, 191, 0.7)',
                                'rgba(191, 191, 63, 0.7)'
                            ]
                        }
                    ],
                }}
        }
            return null;
    }
    render() {
        return (
            <div className="chart">
                <Bar
                    data={this.state.data}
                    options={this.state.options}
                />
            </div>
        )
    }
}
