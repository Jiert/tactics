import React, { Component } from 'react';
import styled from 'styled-components';
import Square from './square';

const Wrapper = styled.div`
  padding: 30px 30px 200px;
  flex-wrap: wrap;
  display: flex;
  height: ${props => 50 * props.height}px;
  width: ${props => 50 * props.width}px;
`;

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
    return false
  }

  render() {
    const squares = getSquares(this.props.boardHeight, this.props.boardWidth)

    return (
      <Wrapper height={this.props.boardHeight} width={this.props.boardWidth}>
        {squares.map(square => 
          <Square key={`${square.x}.${square.y}`} square={square} />
        )}
      </Wrapper>
    );
  }
}

export default Squares;
