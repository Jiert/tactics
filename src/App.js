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


    // this.io.on('players', players => {
    //   // TODO: I think we should put players in redux, but for now
    //   this.setState({players})

    //   console.log('player: ', this.player)
    //   console.log(players)
    // });

    // this.io.on('playerAdded', player => {
    //   if (player === this.state.player) {
    //     // TODO: Not sure "connected" is the correct term here
    //     this.setState({connected: true}) 
    //     console.log('connected')
    //   }
    // });


    // The thing we'll have to do is make sure that all emit calls have the same
    // side effects


    // TODO: Put player, connected in react-redux
    this.state = {
      boardHeight: 20,
      boardWidth: 30,
      // connected: false,
      // players: [],
      // player: null
    }
  }

  // TODO: Account for players, player, etc from sockets
  // shouldComponentUpdate(nextProps, nextState) {
  //   // TODO: Create a menu component and remove all this
  //   if (!isEqual(this.props.activeUnit.id, nextProps.activeUnit.id)) {
  //     return true;
  //   }
  //   return false;
  // }

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
