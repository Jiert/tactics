import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {setAttackingUnit, setMoveMode} from './actions';
import {createNewWarrior, createNewCastle} from './utils';

const mapStateToProps = state => ({
  units: state.units,
  activeUnit: state.activeUnit,
  commanderId: state.commander.id
});

const mapDispatchToProps = dispatch => ({
  setMoveMode: bool => dispatch(setMoveMode(bool)),
  setAttackingUnit: id => dispatch(setAttackingUnit(id))
})

// NOTE: this can be a dumb component at this point

class Menu extends Component {
  constructor(props) {
    super(props);

    this.onMove = this.onMove.bind(this);
    this.onWarrior = this.onWarrior.bind(this);
    this.onAttack = this.onAttack.bind(this);
    this.onCastle = this.onCastle.bind(this);
    this.onFinishTurn = this.onFinishTurn.bind(this);
    this.onPlayer = this.onPlayer.bind(this);
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
    // I don't think we need to emit this one
    this.props.setMoveMode(true);
  }

  onAttack() {
    // I don't think we need to emit here either
    this.props.setAttackingUnit(this.props.activeUnit.id);
  }

  onFinishTurn() {
    // this.io.emit('turn', 'turn');
    // this.props.finishTurn();
  }

  onPlayer() {
    // const player = new Date().toISOString()

    // this.setState({player}, () => {
      // this.io.emit('player', this.state.player)
    // })
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
    // if (this.state.players.length < 2) {
      return <button onClick={this.onPlayer}>New Player</button>;
    // }
    // return null;
  }

  renderGameButtons() {
    // if (this.state.player && this.state.connected) {
      return (
        <div>
          <button onClick={this.onWarrior}>New Warrior</button>
          <button onClick={this.onCastle}>New Castle</button>
          <button onClick={this.onFinishTurn}>Finish Turn</button>
        </div>
      );
    // }
    // return null;
  }

  render() {
    return (
      <div className="app-menu">
        {this.renderGameButtons()}
        {this.renderPlayerButton()}
        {this.props.activeUnit.id && this.renderActiveUnit()}
      </div>
    );
  }
}

Menu.contextTypes = {
  io: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);