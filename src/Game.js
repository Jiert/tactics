import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Squares from './Squares';
import Menu from './Menu';

class Game extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      boardHeight: 20,
      boardWidth: 30,
    }
  }

  render() {
    return (
      <div>
        <Squares 
          boardHeight={this.state.boardHeight} 
          boardWidth={this.state.boardWidth} 
        />
        <Menu />
      </div>
    )
  }

}

export default Game;
