import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';

import {setDestinationIntent, setMoveMode, setActiveUnit} from './actions';
import Unit from './unit';
import isEqual from 'lodash.isequal';
import {distanceMoved} from './utils';

const backgroundColor = props => {
  if (props.hover && !props.unit) {
    return 'rgba(134, 234, 116, 0.60)';
  }

  if (props.highlight) {
    return 'rgba(134, 234, 116, 0.30)';
  }

  return 'rgba(134, 234, 116, 0.17)';
};

const Wrapper = styled.div`
  background: ${props => backgroundColor(props)};
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
`;

class Square extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.key = `${props.square.x}.${props.square.y}`;
    this.location = {
      x: props.square.x,
      y: props.square.y
    };

    this.state = {
      unit: this.getUnit(props),
      hover: false,
      hightlight: false
    };
  }

  getUnit(props) {
    const unitId = props.unitsByLocation && props.unitsByLocation[this.key];
    const unit = props.units[unitId];

    return unit || null;
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.state.unit &&
      nextProps.unitMoving &&
      nextProps.activeUnit.id === this.state.unit.id &&
      nextProps.intendedDestination &&
      !isEqual(nextProps.intendedDestination, this.location)
    ) {
      // 1. update the unit's movesLeft property
      const moved = distanceMoved(this.location, nextProps.intendedDestination);

      this.context.io.emit('updateUnit', this.state.unit.id, {
        movesLeft: this.state.unit.movesLeft - moved
      });

      // 2. Remove the unit at this location
      this.context.io.emit('setUnitLocation', null, this.location);

      // 3. Move the unit to the new place (at some point we'll need to make sure it's successful)
      this.context.io.emit(
        'setUnitLocation',
        nextProps.activeUnit.id,
        nextProps.intendedDestination
      );

      // 4. Since we're using the active Unit here, we need to update it's location
      // We don't need to emit this one becuase the other player doesn't see the active unit
      this.props.setActiveUnit(
        nextProps.activeUnit.id,
        nextProps.intendedDestination
      );

      // 5. Null out intent, moving,
      this.props.setDestinationIntent(null);
      this.props.setMoveMode(false);
    }

    const unit = this.getUnit(nextProps);
    const highlight = this.inRange(nextProps, this.state);

    this.setState({
      unit,
      highlight
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextUnit = this.getUnit(nextProps);

    if (
      (nextUnit && this.state.unit === null) ||
      (nextUnit && this.state.unit && !isEqual(this.state.unit, nextUnit)) ||
      this.state.hover !== nextState.hover ||
      this.inRange(nextProps, nextState) ||
      this.props.unitsByLocation[this.key] !==
        nextProps.unitsByLocation[this.key] ||
      (this.state.highlight && this.props.unitMoving !== nextProps.unitMoving)
    ) {
      return true;
    }
    return false;
  }

  // TODO: This should be on the prototype or a standalone function
  inRange(props, state) {
    if (!props.unitMoving || !props.activeUnit.location) {
      return false;
    }

    // at some point we'll have to pass in the moving unit's mobility prop, but for now
    const movingUnitLocation = props.activeUnit.location;
    const movement = props.units[props.activeUnit.id].movesLeft;

    // both x AND y have to be less than movement
    const xValid = Math.abs(this.location.x - movingUnitLocation.x) <= movement;
    const yValid = Math.abs(this.location.y - movingUnitLocation.y) <= movement;

    return xValid && yValid;
  }

  onClick(event) {
    if (this.props.unitMoving) {
      if (this.inRange(this.props, this.state)) {
        this.props.setDestinationIntent(this.location);
      } else {
        return;
      }
    } else {
      this.props.setActiveUnit(null, null);
    }
  }

  onMouseEnter(event) {
    // maybe we should check for a unit here too
    if (this.state.highlight) {
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
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        highlight={this.state.highlight}
        hover={this.state.hover}
        unit={this.state.unit}
      >
        <span>
          {this.props.square.x}
          {this.props.square.y}
        </span>
        {this.state.unit &&
          <Unit unit={this.state.unit} location={this.location} />}
      </Wrapper>
    );
  }
}

Square.contextTypes = {
  io: PropTypes.object
};

Square.propTypes = {
  intendedDestination: PropTypes.object,
  activeUnit: PropTypes.object.isRequired,
  unitsByLocation: PropTypes.object.isRequired,
  unitMoving: PropTypes.bool.isRequired,
  setMoveMode: PropTypes.func.isRequired,
  setActiveUnit: PropTypes.func.isRequired,
  setDestinationIntent: PropTypes.func.isRequired,
  square: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  intendedDestination: state.move.intendedDestination,
  activeUnit: state.activeUnit,
  units: state.units,
  unitsByLocation: state.unitsByLocation,
  unitMoving: state.move.mode
});

const mapDispatchToProps = dispatch => ({
  setMoveMode: bool => dispatch(setMoveMode(bool)),
  setActiveUnit: (id, location) => dispatch(setActiveUnit(id, location)),
  setDestinationIntent: location => dispatch(setDestinationIntent(location))
});

export default connect(mapStateToProps, mapDispatchToProps)(Square);
