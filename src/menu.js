import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {setAttackingUnit, setMoveMode} from './actions';

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

const SideColumn = styled(Column)``;

const CenterColumn = styled(Column)`
  z-index: 1;
  h2,
  p {
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
    this.unitCanAct = this.unitCanAct.bind(this);
  }

  unitCanAct() {
    return (
      this.props.activePlayer &&
      this.props.activeUnit &&
      this.props.activeUnit.movesLeft
    );
  }

  onWarrior() {
    const location = {x: 7, y: 2};

    this.context.io.emit('createWarrior', this.props.commanderId, location);
  }

  onCastle() {
    const location = {x: 7, y: 4};

    this.context.io.emit('createNewCastle', this.props.commanderId, location);
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
    return (
      <div>
        <h2>
          {this.props.activeUnit.symbol} {this.props.activeUnit.name}
        </h2>
        <ul>
          <li>
            Health: {this.props.activeUnit.health} /{' '}
            {this.props.activeUnit.maxHealth}
          </li>
          <li>Mobility: {this.props.activeUnit.mobility}</li>
          <li>Available Moves: {this.props.activeUnit.movesLeft}</li>
        </ul>
      </div>
    );
  }

  render() {
    // Note: Temporarily removing the create buttons

    return (
      <Wrapper>
        <SideColumn>
          {false && (
            <button
              onClick={this.onWarrior}
              disabled={!this.props.activePlayer}
            >
              New Warrior
            </button>
          )}
          {false && (
            <button onClick={this.onCastle} disabled={!this.props.activePlayer}>
              New Castle
            </button>
          )}
        </SideColumn>
        <CenterColumn>
          {this.props.activeUnit && this.renderActiveUnit()}
          {this.props.activePlayer &&
          !this.props.activeUnit && <p>It is your turn.</p>}
          {!this.props.activePlayer && <p>Waiting for opponent...</p>}
        </CenterColumn>
        <SideColumn>
          <button onClick={this.onMove} disabled={!this.unitCanAct()}>
            Move
          </button>
          <button onClick={this.onAttack} disabled={!this.unitCanAct()}>
            Attack
          </button>
          <button
            onClick={this.onFinishTurn}
            disabled={!this.props.activePlayer}
          >
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
  activeUnit: PropTypes.object,
  commanderId: PropTypes.string.isRequired,
  opponentId: PropTypes.string.isRequired,
  setMoveMode: PropTypes.func.isRequired,
  setAttackingUnit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  units: state.units,
  commanderId: state.commander.id,
  opponentId: state.opponent.id,
  activePlayer: state.activePlayer === state.commander.id,
  activeUnit: state.units[state.activeUnit.id]
});

const mapDispatchToProps = dispatch => ({
  setMoveMode: bool => dispatch(setMoveMode(bool)),
  setAttackingUnit: id => dispatch(setAttackingUnit(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
