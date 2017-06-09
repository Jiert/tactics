import React, { Component } from 'react';
import {connect} from 'react-redux';
import {addUnit, setUnitLocation, setMoveMode} from './actions';
import Unit from './Unit';
import Square from './Square';

import {createNewWarrior} from './utils';

import './App.css';

const mapStateToProps = state => ({
  units: state.units,
  activeUnit: state.activeUnit
});

const mapDispatchToProps = dispatch => ({
  addUnit: (unit, location) => dispatch(addUnit(unit, location)),
  setUnitLocation: (unit, location) => dispatch(setUnitLocation(unit, location)),
  setMoveMode: bool => dispatch(setMoveMode(bool)) 
})

class App extends Component {

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onOtherClick = this.onOtherClick.bind(this);

    this.onMove = this.onMove.bind(this);

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
    const warrior1 = createNewWarrior();
    this.props.addUnit(warrior1);
    this.props.setUnitLocation(warrior1.id, {x: 7, y: 2})
  }

  onOtherClick() {
    const warrior2 = createNewWarrior();
    this.props.addUnit(warrior2);
    this.props.setUnitLocation(warrior2.id, {x: 7, y: 4})
  }

  onMove() {
    this.props.setMoveMode(true);
  }

  render() {
    return (
      <div className="App">
        <div className="board">
          {this.squares().map(square => <Square key={`${square.height}${square.width}`} square={square} units={this.props.units}/>)}
        </div>

        <div>
          <h2>Monkey</h2>

          <button onClick={this.onClick}>New Warrior</button>
          <button onClick={this.onOtherClick}>New Other Warrior</button>

          <h5>Active Unit</h5>

          <ul>
            <li>{this.props.activeUnit.name}</li>
            <li>{this.props.activeUnit.id}</li>
            <li>{this.props.activeUnit.hitPoints}</li>
            <li>{this.props.activeUnit.symbol}</li>
          </ul>


          <button onClick={this.onMove}>Move</button>


        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
