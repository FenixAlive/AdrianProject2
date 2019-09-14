import React, { Component } from 'react';

export default class Modal extends Component {
  constructor(props){
    super(props);
  }
  render() {
          if(!this.props.modalOpen){
            return null;
          }else{
            return (
                <div className="container">
                  <div className="row">
                    <div id="modal" className="col-8 mx-auto col-md-6 col-lg-4 text-center text-capitalize p-3">
                      <h5 className="text-red">Titulo</h5>
                      <h5 className=""></h5>
                      <h6 className=""></h6>
                    </div>
                  </div>
                </div>
            )
          }
    }
}
