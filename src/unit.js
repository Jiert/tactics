import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {setMoveMode, setActiveUnit, setAttackingUnit} from './actions';
import {inRange} from './utils';

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const healthPercent = props => props.unit.health / props.unit.maxHealth * 100;

/*
 * NOTE: So again, this is going to require that we assume the attacking
 * unit is the same as the active unit, and all of this logic happens locally.
 * At some point it might be better to determine this on the server
 * TODO: This should all be on the server.
 * TODO: gotta rethink this pattern. Maybe we set all of the unit object active */
const shouldBattle = props =>
  props.unit && // <- there's a unit here to attack
  props.attackingUnitId && // <-- there's a unit who is attacking
  props.attackingUnitId !== props.unit.id && // <- they aren't the same unit
  props.units[props.activeUnit.id].movesLeft && // <- the attacking unit has moves left. This might not be necessary if moves left is updated correctly after a move or attack.
  inRange(
    props.location,
    props.activeUnit.location,
    props.units[props.activeUnit.id].attackRange
  ) && // <- The units are within attack range of the attacking unit
  props.unit.commanderId !== props.commanderId; // <- the units aren't on the same team

const Wrapper = styled.div`
  box-shadow: ${props =>
    props.active
      ? 'inset 0 0 0px 1px #c1c1c1, inset 0 0 10px 2px yellow'
      : 'none'};
  flex-direction: column;
  font-size: 26px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  &:hover {
    cursor: pointer;
  }
`;

const HealthContainer = styled.div`width: 75%;`;

const Health = styled.div`
  height: 3px;
  width: ${props => healthPercent(props)}%;
  background: #25bf25;
`;

const UnitContainer = styled.div`
  border-radius: 10%;
  box-shadow: ${props => `inset 0 0 0px 2px ${props.color}`};
  background: #fff;
  padding: 2px 6px 0;
  margin-top: 3px;
`;

class Unit extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  //TODO: Think about implementing shouldComponentUpdate
  componentWillReceiveProps(nextProps) {
    if (this.props.unit.health > 0 && nextProps.unit.health <= 0) {
      this.perish();
    }
  }

  perish() {
    // 1: Set (or delete) this unit's id from the location map
    this.context.io.emit('setUnitLocation', null, this.props.location);

    // 2: Profit? Is that all?
  }

  battle() {
    // NOTE: Recall teh DND article
    // Units should probably have "hitPoints" or "attackPoints" to represent
    // their baseline number for damage they can cause.
    // For now though, we'll just randomly halve the hit points

    // TODO: This should all happen on the server

    const random = getRandomInt(1, this.props.unit.maxHealth / 2);
    const newHealth = this.props.unit.health - random;

    this.context.io.emit('updateUnit', this.props.unit.id, {
      health: newHealth
    });

    this.props.setAttackingUnit(null);
  }

  // TODO: This should all be on the server toooooo....
  updateAttackersMoves() {
    const attackingUnit = this.props.units[this.props.activeUnit.id];
    const movesLeft = attackingUnit.movesLeft - 1;
    this.context.io.emit('updateUnit', attackingUnit.id, {
      movesLeft
    });
  }

  onClick(event) {
    event.stopPropagation();

    // NOTE: will need to think about teams here
    // NOTE: Attacking unit information seems useless, but attacking unit
    // may not always be the active unit (for the enemny, or player 2)

    // Can't move to a square that has a unit
    // TODO: Does ^ this make sense? <-- yes because this is a unit.
    // Maybe someeday we will move to attack, but for now this makes sense.
    if (this.props.unitMoving) {
      return;
    }

    // If a unit is attacking, it can't attack a unit on its own team
    if (
      this.props.attackingUnitId &&
      this.props.unit.commanderId === this.props.commanderId
    ) {
      return;
    }

    if (shouldBattle(this.props)) {
      this.battle();
      this.updateAttackersMoves();
    } else if (this.props.unit.commanderId === this.props.commanderId) {
      this.props.setMoveMode(false);
      this.props.setAttackingUnit(null);
      this.props.setActiveUnit(this.props.unit.id, this.props.location);
    }
  }

  render() {
    return (
      <Wrapper onClick={this.onClick} active={this.props.active}>
        <HealthContainer>
          <Health unit={this.props.unit} />
        </HealthContainer>
        <UnitContainer color={this.props.color}>
          {this.props.unit.symbol}
        </UnitContainer>
      </Wrapper>
    );
  }
}

Unit.propTypes = {
  activeUnit: PropTypes.object,
  unit: PropTypes.object.isRequired,
  units: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  attackingUnitId: PropTypes.string,
  commanderId: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  unitMoving: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  setMoveMode: PropTypes.func.isRequired,
  setAttackingUnit: PropTypes.func.isRequired,
  setActiveUnit: PropTypes.func.isRequired
};

Unit.contextTypes = {
  io: PropTypes.object
};

// TODO: Let's see if we can cut down on the amount of props here
const mapStateToProps = (state, ownProps) => ({
  active: state.activeUnit && state.activeUnit.id === ownProps.unit.id,
  activeUnit: state.activeUnit,
  attackingUnitId: state.move.attackingUnitId,
  commanderId: state.commander.id,
  unitMoving: state.move.mode,
  color: state.players[ownProps.unit.commanderId].color,
  units: state.units
});

const mapDispatchToProps = dispatch => ({
  setMoveMode: bool => dispatch(setMoveMode(bool)),
  setAttackingUnit: id => dispatch(setAttackingUnit(id)),
  setActiveUnit: (id, location) => dispatch(setActiveUnit(id, location))
});

export default connect(mapStateToProps, mapDispatchToProps)(Unit);
