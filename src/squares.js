import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import Square from './square';

// TODO: Parametarize these again
// height: ${props => 50 * props.boardHeight}px;
// width: ${props => 50 * props.boardWidth}px;
const Wrapper = styled.div`
  margin: auto;
  padding: 30px 30px 200px;
  flex-wrap: wrap;
  display: flex;
  height: 1000px;
  width: 1500px;
`;

class Squares extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
      <Wrapper>
        {Object.keys(this.props.squares).map(key => {
          const square = this.props.squares[key];
          const location = `${square.location.x}.${square.location.y}`;

          return <Square key={location} location={location} />;
        })}
      </Wrapper>
    );
  }
}

Squares.propTypes = {
  squares: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  squares: state.squares
});

export default connect(mapStateToProps)(Squares);
