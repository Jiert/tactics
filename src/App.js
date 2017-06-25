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

    // Note: to Support Multiple sessions, 
    // We could use a query param to id different games

    this.onMove = this.onMove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onAttack = this.onAttack.bind(this);
    this.onOtherClick = this.onOtherClick.bind(this);
    this.onFinishTurn = this.onFinishTurn.bind(this);
    this.onPlayer = this.onPlayer.bind(this);

    // Maybe we can do all this again in another component
    // and if that works ... 
    this.io = io('http://localhost:8080');

    this.io.on('players', players => {
      // TODO: I think we should put players in redux, but for now
      this.setState({players})

      console.log('player: ', this.player)
      console.log(players)
    });

    this.io.on('playerAdded', player => {
      if (player === this.state.player) {
        // TODO: Not sure "connected" is the correct term here
        this.setState({connected: true}) 
        console.log('connected')
      }
    });

    // TESTING (wooot, this works)
    // So how can we share this.io
    this.io.on('addUnit', unit => {
      this.props.addUnit(unit);
      this.props.setUnitLocation(unit.id, {x: 7, y: 2})
    })


    this.io.on('error', error => {
      console.log(error);
    });

    // TODO: Put player, connected in react-redux
    this.state = {
      boardHeight: 20,
      boardWidth: 30,
      connected: false,
      players: [],
      player: null
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

  onClick() {
    const warrior1 = createNewWarrior();

    this.io.emit('addUnit', warrior1);
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
    this.io.emit('turn', 'turn');
    this.props.finishTurn();
  }

  onPlayer() {
    const player = new Date().toISOString()

    this.setState({player}, () => {
      this.io.emit('player', this.state.player)
    })
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

  renderPlayerButton() {
    if (this.state.players.length < 2) {
      return <button onClick={this.onPlayer}>New Player</button>;
    }
    return null;
  }

  renderGameButtons() {
    if (this.state.player && this.state.connected) {
      return (
        <div>
          <button onClick={this.onClick}>New Warrior</button>
          <button onClick={this.onOtherClick}>New Castle</button>
          <button onClick={this.onFinishTurn}>Finish Turn</button>
        </div>
      );
    }
    return null;
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

          {this.renderGameButtons()}
          {this.renderPlayerButton()}
          
          {this.props.activeUnit.id && this.renderActiveUnit()}
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
