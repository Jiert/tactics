import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';

import {
  setDestinationIntent,
  setMoveMode,
  setActiveUnit,
  clearAttackingUnit
} from './actions';
import Unit from './unit';
import isEqual from 'lodash.isequal';
import {distanceMoved, inRange} from './utils';

const darkGreen = 'rgba(134, 234, 116, 0.60)';
const lightGreen = 'rgba(134, 234, 116, 0.17)';
const mediumGreen = 'rgba(134, 234, 116, 0.30)';
const attackRangeRed = '#ffe0e0';

const backgroundColor = props => {
  if (props.moving) {
    if (props.hover && !props.unit) {
      return darkGreen;
    }
    if (props.highlight) {
      return mediumGreen;
    }
  }

  if (props.attackHighlight) {
    return attackRangeRed;
  }

  return lightGreen;
};

const backgroundImage = props => {
  if (props.type) {
    switch (props.type.name) {
      case 'Forest':
        return '🌲';
      case 'Hills':
        return '⛰';
      case 'Mountains':
        return '🏔';
      default:
        return '';
    }
  }

  return '';
};

// NOTE: For the background icon, we should create another component <Icon>
// That handles this specifically. that we can use css filters and masts, etc.
const Wrapper = styled.div`
  position: relative;
  background-color: ${props => backgroundColor(props)};
  background-position: center;
  background-repeat: no-repeat;
  height: 50px;
  width: 50px;
  box-shadow: inset 1px 1px 0px 0px rgb(255, 255, 255),
    inset -1px -1px 0px rgba(187, 187, 187, 0.37);
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    display: none;
  }
  &::before {
    z-index: -1;
    font-size: 2.5em;
    content: '${props => backgroundImage(props)}';
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0.75;
  }
`;

class Square extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.moveUnit = this.moveUnit.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.unitHereShouldMove = this.unitHereShouldMove.bind(this);
    this.inRangeOfAttack = this.inRangeOfAttack.bind(this);

    this.state = {
      hover: false,
      highlight: false
    };
  }

  unitHereShouldMove(props) {
    return (
      this.props.unit &&
      props.unitMoving &&
      props.activeUnit.id === this.props.unit.id &&
      props.intendedDestination &&
      !isEqual(props.intendedDestination, this.props.square.location)
    );
  }

  // TODO: Write a generic inrange function and a specific function that uses
  // it for each of the types of rangtes (attack, move)
  inRangeOfAttack(nextProps) {
    /* NOTES: the purpose is to determine whether to highlight this square.
     * We highlight if we are in range of the attacking unit's location
     * we can infer that the attackingUnitId equals the activeUnit's ID
     * We don't need to share highlights with other user (local only)
    */

    // if there's no attacking unit, return
    if (!nextProps.attackingUnitId) {
      return false;
    }

    // if the attacking unit is on this square, return
    if (this.props.unit && this.props.unit.id === nextProps.attackingUnitId) {
      return false;
    }

    // If the attacking unit's id isn't the same as the
    // active unit's id, something is fucked
    if (nextProps.attackingUnitId !== this.props.activeUnit.id) {
      return false;
    }

    const attackingUnitLocation = this.props.activeUnit.location;
    const attackRange = this.props.units[this.props.activeUnit.id].attackRange;

    return inRange(
      this.props.square.location,
      attackingUnitLocation,
      attackRange
    );
  }

  moveUnit(props) {
    // 1. update the unit's movesLeft property

    // TODO: Take into account props.square.type
    // NOTE: I think this should happen befor the move click
    const moved = distanceMoved(
      this.props.square.location,
      props.intendedDestination
    );

    this.context.io.emit('updateUnit', this.props.unit.id, {
      movesLeft: this.props.unit.movesLeft - moved
    });

    // 2. Remove the unit at this location
    this.context.io.emit('setUnitAtSquare', null, this.props.square.location);

    // 3. Move the unit to the new place (at some point we'll need to make sure it's successful)
    this.context.io.emit(
      'setUnitAtSquare',
      props.activeUnit.id,
      props.intendedDestination
    );

    // 4. Since we're using the active Unit here, we need to update it's location
    // We don't need to emit this one becuase the other player doesn't see the active unit
    this.props.dispatch(
      setActiveUnit(props.activeUnit.id, props.intendedDestination)
    );

    // 5. Null out intent, moving,
    this.props.dispatch(setDestinationIntent(null));
    this.props.dispatch(setMoveMode(false));
  }

  componentWillReceiveProps(nextProps) {
    // TODO: All of this logic is concerned with moving
    // We need to clean this up and start implementing logic
    // for attacking (if we want highlighting on empty squares for attack range)
    if (this.unitHereShouldMove(nextProps)) {
      this.moveUnit(nextProps);
    }

    const highlight = this.inMovingUnitsRange(nextProps);
    const attackHighlight = this.inRangeOfAttack(nextProps);

    this.setState({
      highlight,
      attackHighlight
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !isEqual(this.props.unit, nextProps.unit) ||
      this.state.hover !== nextState.hover ||
      this.inMovingUnitsRange(nextProps) ||
      this.state.attackHighlight !== nextState.attackHighlight ||
      (this.state.highlight && this.props.unitMoving !== nextProps.unitMoving)
    ) {
      return true;
    }
    return false;
  }

  // TODO: This should be on the prototype or a standalone function
  inMovingUnitsRange(props) {
    // TODO: Need to take into account the movement penalties
    if (!props.unitMoving || !props.activeUnit.location) {
      return false;
    }

    const movingUnitLocation = props.activeUnit.location;

    // movement needs to check against penalty.
    // we should think about storig all of the acive units info in state so
    // we can get rid of mapping all units to every single square
    const movement = props.units[props.activeUnit.id].movesLeft;
    const penalty =
      this.props.square.type && this.props.square.type.movementPenalty;

    // TODO: This is buggy, I don't calculate the total distance, so a unit
    // can travel over a mountain range in one move
    const distance = penalty ? movement - penalty : movement;

    return inRange(this.props.square.location, movingUnitLocation, distance);
  }

  onClick(event) {
    if (this.props.unitMoving) {
      if (this.inMovingUnitsRange(this.props)) {
        this.props.dispatch(setDestinationIntent(this.props.square.location));
      } else {
        this.props.dispatch(setMoveMode(false));
      }
    } else if (this.props.attackingUnitId) {
      this.props.dispatch(clearAttackingUnit());
    } else {
      // TODO maybe do a check here instead of spamming
      this.props.dispatch(setActiveUnit(null, null));
    }
  }

  onMouseEnter(event) {
    // maybe we should check for a unit here too
    if (this.state.highlight || this.state.attackHighlight) {
      this.setState({hover: true});
    }
  }

  onMouseLeave(event) {
    if (this.state.hover) {
      this.setState({hover: false});
    }
  }

  render() {
    return (
      <Wrapper
        type={this.props.square.type}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        highlight={this.state.highlight}
        attackHighlight={this.state.attackHighlight}
        hover={this.state.hover}
        unit={this.props.unit}
        moving={this.props.unitMoving}
      >
        <span>
          {this.props.location}
        </span>
        {this.props.unit &&
          <Unit unit={this.props.unit} location={this.props.square.location} />}
      </Wrapper>
    );
  }
}

Square.contextTypes = {
  io: PropTypes.object
};

Square.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.string,
  unit: PropTypes.object,
  square: PropTypes.object.isRequired,
  attackingUnitId: PropTypes.string,
  activeUnit: PropTypes.object.isRequired,
  unitMoving: PropTypes.bool.isRequired
};

// TODO: Think about how we can cut down on prop changes
const mapStateToProps = (state, ownProps) => {
  const square = state.squares[ownProps.location];

  return {
    attackingUnitId: state.move.attackingUnitId,
    intendedDestination: state.move.intendedDestination,
    activeUnit: state.activeUnit,
    square,
    unit: state.units[square.unitId],
    // TODO: don't do this!
    units: state.units,
    unitMoving: state.move.mode
  };
};

export default connect(mapStateToProps)(Square);
