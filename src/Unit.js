import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {
  updateUnit,
  setMoveMode,
  setActiveUnit,
  setAttackingUnit
} from './actions';

const mapStateToProps = (state, ownProps)=> ({
  units: state.units,
  activeUnit: state.activeUnit,
  active: state.activeUnit && state.activeUnit.id === ownProps.unit.id,
  attackingUnitId: state.move.attackingUnitId,
  unitsByLocation: state.unitsByLocation,
  commanderId: state.commander.id,
  unitMoving: state.move.mode,
  color: state.players[ownProps.unit.commanderId].color
});

const mapDispatchToProps = dispatch => ({
  setMoveMode: bool => dispatch(setMoveMode(bool)),
  setAttackingUnit: id => dispatch(setAttackingUnit(id)),
  setActiveUnit: (id, location)=> dispatch(setActiveUnit(id, location)),
})

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const healthPercent = props => props.unit.health / props.unit.maxHealth * 100;

const Wrapper = styled.div`
  font-size: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  &:hover {
    cursor: pointer;
  }
  box-shadow: ${props => props.active 
    ? 'inset 0 0 0px 2px rgb(255, 238, 37)'
    : props => `inset 0 0 0px 2px ${props.color}`}
`;

const HealthContainer = styled.div`
  position: absolute;
  top: 3px;
  left: 10px;
  right: 10px;
`;

const Health = styled.div`
  height: 3px;
  width: ${props => healthPercent(props)}%;
  background: #25bf25;
`;

class Unit extends Component {
  constructor(props) {
    super(props);
    
    this.onClick = this.onClick.bind(this);
    this.shouldBattle = this.shouldBattle.bind(this);
  }

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

    const random = getRandomInt(1, this.props.unit.maxHealth / 2);
    const newHealth = this.props.unit.health - random;

    this.context.io.emit('updateUnit', this.props.unit.id, {
      health: newHealth
    })

    this.props.setAttackingUnit(null);
  }

  // TODO: pull this out of the class
  shouldBattle() {
    return (
      this.props.unit &&
      this.props.attackingUnitId &&
      this.props.attackingUnitId !== this.props.unit.id &&
      // TODO: This is as clear as MUD, maybe?
      this.props.unit.commanderId !== this.props.commanderId
    )
  }

  onClick(event) {
    event.stopPropagation();

    // NOTE: will need to think about teams here
    // NOTE: Attacking unit information seems useless, but attacking unit 
    // may not always be the active unit (for the enemny, or player 2)

    // Can't move to a square that has a unit
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

    if (this.shouldBattle()) {
      this.battle();
    } else if (this.props.unit.commanderId === this.props.commanderId) {
      this.props.setMoveMode(false);
      this.props.setAttackingUnit(null);
      this.props.setActiveUnit(this.props.unit.id, this.props.location);
    }
  }

  render() {
    return(
      <Wrapper
        onClick={this.onClick}
        active={this.props.active}
        color={this.props.color}
      >
        <HealthContainer>
          <Health unit={this.props.unit} />
        </HealthContainer>
        {this.props.unit.symbol}
      </Wrapper>
    )
  }
}

Unit.propTypes = {
  unit: PropTypes.object.isRequired
}

Unit.contextTypes = {
  io: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(Unit);
