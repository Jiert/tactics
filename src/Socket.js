import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

import {updateState} from './actions';

const mapDispatchToProps = dispatch => ({
  updateState: state => dispatch(updateState(state))
})

class Socket extends Component {
  constructor(props) {
    super(props);
  
    this.io = io('http://localhost:8080');

    this.io.on('change', state => {
      this.props.updateState(state);
    })

    this.io.emit('getState');
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