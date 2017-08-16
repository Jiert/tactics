import React, { Component } from 'react';
import Square from './Square';

const getSquares = (height, width) => {
  const squares = [];

  for (var y = height; y >= 1; y--) {
    for (var x = 1; x <= width; x++) {
      squares.push({x, y})  
    }
  }

  return squares;
}

class Squares extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    // I meen... right? 
    return false
  }

  render() {
    const boardStyles = {
      height: 50 * this.props.boardHeight,
      width: 50 * this.props.boardWidth
    }

    const squares = getSquares(this.props.boardHeight, this.props.boardWidth)

    return (
      <div className="board" style={boardStyles}>
        {squares.map(square => <Square key={`${square.x}.${square.y}`} square={square} />)}
      </div>
    );
  }

}

export default Squares;
