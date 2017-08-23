import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

import {updateState, ioDisconnect, ioConnect} from './actions';

const mapDispatchToProps = dispatch => ({
  updateState: state => dispatch(updateState(state)),
  connect: state => dispatch(ioConnect()),
  disconnect: state => dispatch(ioDisconnect())
});

class Socket extends Component {
  constructor(props) {
    super(props);

    this.io = io('http://localhost:8080');

    this.io.on('change', state => {
      this.props.updateState(state);
    });

    this.io.on('connect', () => {
      this.props.connect();
    });

    this.io.on('disconnect', () => {
      this.props.disconnect();
      delete localStorage.tactics;
    });

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
    );
  }
}

Socket.propTypes = {
  children: PropTypes.object,
  connect: PropTypes.func.isRequired,
  disconnect: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired
};

Socket.childContextTypes = {
  io: PropTypes.object
};

export default connect(null, mapDispatchToProps)(Socket);
