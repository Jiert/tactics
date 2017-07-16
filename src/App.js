import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import io from 'socket.io-client';

import Socket from './Socket';
import Squares from './Squares';
import Menu from './Menu';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    // Note: to Support Multiple sessions, 
    // We could use a query param to id different games

    this.state = {
      boardHeight: 20,
      boardWidth: 30,
    }
  }

  render() {
    console.log('app render')

    return (
      <div className="App">
        <Socket>
          <Squares 
            boardHeight={this.state.boardHeight} 
            boardWidth={this.state.boardWidth} 
          />
          <Menu />
        </Socket>
      </div>
    );
  }
}

export default App;


// export default connect(mapStateToProps, mapDispatchToProps)(App);
