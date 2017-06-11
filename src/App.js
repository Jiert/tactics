import React, { Component } from 'react';
import {connect} from 'react-redux';
import {
  addUnit, 
  setUnitLocation, 
  setMoveMode,
  setAttackingUnit} from './actions';
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
  setUnitLocation: (id, location) => dispatch(setUnitLocation(id, location)),
  setMoveMode: bool => dispatch(setMoveMode(bool)),
  setAttackingUnit: id => dispatch(setAttackingUnit(id))
})

class App extends Component {

  constructor(props) {
    super(props);

    this.onMove = this.onMove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onAttack = this.onAttack.bind(this);
    this.onOtherClick = this.onOtherClick.bind(this);

    this.state = {
      boardHeight: 10,
      boardWidth: 10,
    }
  }

  squares() {
    const squares = [];

    for (var y = this.state.boardWidth - 1; y >= 0; y--) {
      for (var x = 0; x < this.state.boardHeight; x++) {
        squares.push({x, y})
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

  onAttack() {
    this.props.setAttackingUnit(this.props.activeUnit.id);
  }

  renderActiveUnit() {
    const unit = this.props.units[this.props.activeUnit.id];

    return (
      <div>
        <h2>{unit.name}</h2>
        <ul>
          <li>Id: {unit.id}</li>
          <li>Health: {unit.health} / {unit.maxHealth}</li>
        </ul>
        <button onClick={this.onMove}>Move</button>
        <button onClick={this.onAttack}>Attack</button>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="board">
          {this.squares().map(square => <Square key={`${square.x}${square.y}`} square={square} units={this.props.units}/>)}
        </div>

        <div>

          <button onClick={this.onClick}>New Warrior</button>
          <button onClick={this.onOtherClick}>New Other Warrior</button>

          {this.props.activeUnit.id && this.renderActiveUnit()}

        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
