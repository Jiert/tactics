import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

import {
  addUnit, 
  finishTurn,
  setUnitLocation, 
} from './actions';

const mapDispatchToProps = dispatch => ({
  addUnit: (unit, location) => dispatch(addUnit(unit, location)),
  setUnitLocation: (id, location) => dispatch(setUnitLocation(id, location)),
  finishTurn: () => dispatch(finishTurn())
})


class Socket extends Component {
  constructor(props) {
    super(props);
  
    this.io = io('http://localhost:8080');

    this.configureListeners();
  }

  shouldComponentUpdate() {
    return false;
  }

  configureListeners() {
    this.io.on('addUnit', (unit, location) => {
      this.props.addUnit(unit);
      this.props.setUnitLocation(unit.id, location)
    });

    this.io.on('setUnitLocation', (unitId, location) => {
      this.props.setUnitLocation(unitId, location)
    });  
  }

  getChildContext() {
    return {io: this.io};
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

Socket.childContextTypes = {
  io: PropTypes.object
};

export default connect(null, mapDispatchToProps)(Socket);