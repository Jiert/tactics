import React, { Component } from 'react';
import {connect} from 'react-redux';
import io from 'socket.io-client';
import {
  addUnit, 
  finishTurn,
  setMoveMode,
  setUnitLocation, 
  setAttackingUnit} from './actions';
import Squares from './Squares';
import {createNewWarrior, createNewCastle} from './utils';
import isEqual from 'lodash.isequal';

import './App.css';

const mapStateToProps = state => ({
  units: state.units,
  activeUnit: state.activeUnit
});

const mapDispatchToProps = dispatch => ({
  addUnit: (unit, location) => dispatch(addUnit(unit, location)),
  setUnitLocation: (id, location) => dispatch(setUnitLocation(id, location)),
  setMoveMode: bool => dispatch(setMoveMode(bool)),
  setAttackingUnit: id => dispatch(setAttackingUnit(id)),
  finishTurn: () => dispatch(finishTurn())
})

class App extends Component {

  constructor(props) {
    super(props);

    this.onMove = this.onMove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onAttack = this.onAttack.bind(this);
    this.onOtherClick = this.onOtherClick.bind(this);
    this.onFinishTurn = this.onFinishTurn.bind(this);

    this.io = io('http://localhost:8080');

    this.state = {
      boardHeight: 20,
      boardWidth: 30,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // TODO: Create a menu component and remove all this
    if (!isEqual(this.props.activeUnit.id, nextProps.activeUnit.id)) {
      return true;
    }
    return false;
  }

  onClick() {
    const warrior1 = createNewWarrior();
    this.props.addUnit(warrior1);
    this.props.setUnitLocation(warrior1.id, {x: 7, y: 2})
  }

  onOtherClick() {
    const castle = createNewCastle();
    this.props.addUnit(castle);
    this.props.setUnitLocation(castle.id, {x: 7, y: 4})
  }

  onMove() {
    this.props.setMoveMode(true);
  }

  onAttack() {
    this.props.setAttackingUnit(this.props.activeUnit.id);
  }

  onFinishTurn() {
    // debugger;
    this.io.emit('turn', 'monkey');
    this.props.finishTurn();
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
    console.log('app render')

    return (
      <div className="App">

        <Squares 
          boardHeight={this.state.boardHeight} 
          boardWidth={this.state.boardWidth} 
        />

        <div className="app-menu">
          <button onClick={this.onClick}>New Warrior</button>
          <button onClick={this.onOtherClick}>New Castle</button>
          <button onClick={this.onFinishTurn}>Finish Turn</button>
          {this.props.activeUnit.id && this.renderActiveUnit()}
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);