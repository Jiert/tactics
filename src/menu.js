import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {setAttackingUnit, setMoveMode} from './actions';
import {createNewWarrior, createNewCastle} from './utils';

const Wrapper = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
`;

const Column = styled.div`
  box-shadow: 0 0 3px;
  background: #ddd;
  flex-basis: 27%;
  padding: 15px;
`;

const SideColumn = styled(Column)`
  
`;

const CenterColumn = styled(Column)`
  z-index: 1;
  h2, p {
    text-align: center;
  }
`;

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
    const location = {x: 7, y: 2};
    const warrior = createNewWarrior(this.props.commanderId);

    this.context.io.emit('addUnit', warrior, location);
  }

  onCastle() {
    const location = {x: 7, y: 4};
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
        <h2>
          {unit.symbol} {unit.name}
        </h2>
        <ul>
          <li>
            Health: {unit.health} / {unit.maxHealth}
          </li>
          <li>
            Mobility: {unit.mobility}
          </li>
          <li>
            Available Moves: {unit.movesLeft}
          </li>
        </ul>
      </div>
    );
  }

  render() {
    const activePlayer = this.props.activePlayer;
    const unitSelected = activePlayer && this.props.activeUnit.id;

    return (
      <Wrapper>
        <SideColumn>
          <button onClick={this.onWarrior} disabled={!activePlayer}>
            New Warrior
          </button>
          <button onClick={this.onCastle} disabled={!activePlayer}>
            New Castle
          </button>
        </SideColumn>
        <CenterColumn>
          {unitSelected && this.renderActiveUnit()}
          {activePlayer && !unitSelected && <p>It is your turn.</p>}
          {!activePlayer && <p>Waiting for opponent...</p>}
        </CenterColumn>
        <SideColumn>
          <button onClick={this.onMove} disabled={!unitSelected}>
            Move
          </button>
          <button onClick={this.onAttack} disabled={!unitSelected}>
            Attack
          </button>
          <button onClick={this.onFinishTurn} disabled={!activePlayer}>
            Finish Turn
          </button>
        </SideColumn>
      </Wrapper>
    );
  }
}

Menu.contextTypes = {
  io: PropTypes.object
};

Menu.propTypes = {
  activePlayer: PropTypes.bool.isRequired,
  activeUnit: PropTypes.object.isRequired,
  commanderId: PropTypes.string.isRequired,
  opponentId: PropTypes.string.isRequired,
  setMoveMode: PropTypes.func.isRequired,
  setAttackingUnit: PropTypes.func.isRequired,
  units: PropTypes.object.isRequired
};

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
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
