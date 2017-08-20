import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {setAttackingUnit, setMoveMode} from './actions';
import {createNewWarrior, createNewCastle} from './utils';

const mapStateToProps = state => ({
  units: state.units,
  activeUnit: state.activeUnit,
  commanderId: state.commander.id,
  opponentId: state.opponent.id,
  activePlayer: state.activePlayer === state.commander.id
});

const mapDispatchToProps = dispatch => ({
  setMoveMode: bool => dispatch(setMoveMode(bool)),
  setAttackingUnit: id => dispatch(setAttackingUnit(id))
})

class Menu extends Component {
  constructor(props) {
    super(props);

    this.onMove = this.onMove.bind(this);
    this.onWarrior = this.onWarrior.bind(this);
    this.onAttack = this.onAttack.bind(this);
    this.onCastle = this.onCastle.bind(this);
    this.onFinishTurn = this.onFinishTurn.bind(this);
  }

  onWarrior() {
    const location = {x: 7, y: 2}
    const warrior = createNewWarrior(this.props.commanderId);

    this.context.io.emit('addUnit', warrior, location);
  }

  onCastle() {
    const location = {x: 7, y: 4}
    const castle = createNewCastle();

    this.context.io.emit('addUnit', castle, location);
  }

  onMove() {
    this.props.setMoveMode(true);
  }

  onAttack() {
    this.props.setAttackingUnit(this.props.activeUnit.id);
  }

  onFinishTurn() {
    this.context.io.emit('setActivePlayer', this.props.opponentId);
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
        {this.props.activePlayer && this.renderActiveUnitButtons()}
      </div>
    );
  }

  renderActiveUnitButtons() {
    return (
      <div>
        <button onClick={this.onMove}>Move</button>
        <button onClick={this.onAttack}>Attack</button>
      </div>
    )
  }

  renderGameButtons() {
    if (this.props.activePlayer) {
      return (
        <div>
          <button onClick={this.onWarrior}>New Warrior</button>
          <button onClick={this.onCastle}>New Castle</button>
          <button onClick={this.onFinishTurn}>Finish Turn</button>
        </div>
      );
    }

    return <p>Waiting for opponent to finish turn</p>
  }

  render() {
    return (
      <div className="app-menu">
        {this.renderGameButtons()}
        {this.props.activeUnit.id && this.renderActiveUnit()}
      </div>
    );
  }
}

Menu.contextTypes = {
  io: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);