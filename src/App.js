import React, { Component } from 'react';
import {connect} from 'react-redux';
import {addUnit} from './actions';
import Unit from './Unit';
import Square from './Square';

import {createNewWarrior} from './utils';

import './App.css';

const mapStateToProps = state => ({
  units: state.units
});

const mapDispatchToProps = dispatch => ({
  addUnit: (unit, location) => dispatch(addUnit(unit, location))
})

class App extends Component {

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.state = {
      boardHeight: 10,
      boardWidth: 10,
    }
  }

  squares() {
    const squares = [];

    for (var height = 0; height < this.state.boardHeight; height++) {
      for (var width = 0; width < this.state.boardWidth; width++) {
        squares.push({height, width})
      }
    }

    return squares;
  }

  onClick() {
    const warrior = createNewWarrior();
    this.props.addUnit(warrior, {x: 8, y: 1})
  }

  render() {
    return (
      <div className="App">
        <h2>Monkey</h2>

        <button onClick={this.onClick}>New Unit</button>

        <div className="board">
          {this.squares().map(square => <Square square={square} units={this.props.units}/>)}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
