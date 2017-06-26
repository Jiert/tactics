import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  setUnitLocation, 
  setDestinationIntent, 
  setMoveMode, 
  setActiveUnit} from './actions';
import Unit from './Unit';
import isEqual from 'lodash.isequal';

const mapStateToProps = state => ({
  intendedDestination: state.move.intendedDestination,
  activeUnit: state.activeUnit,
  units: state.units,
  unitsByLocation: state.unitsByLocation,
  unitMoving: state.move.mode
});

const mapDispatchToProps = dispatch => ({
  setMoveMode: bool => dispatch(setMoveMode(bool)),
  setActiveUnit: (id, location)=> dispatch(setActiveUnit(id, location)),
  setUnitLocation: (id, location) => dispatch(setUnitLocation(id, location)),
  setDestinationIntent: location => dispatch(setDestinationIntent(location))
});

class Square extends Component {
  constructor(props) {
    super(props);
    
    this.onClick = this.onClick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    // console.log(this.context)


    this.state = {
      unit: null,
      key: `${props.square.x}.${props.square.y}`,
      hover: false,
      hightlight: false,
      location: {
        x: props.square.x,
        y: props.square.y
      }
    }
  }

  getUnit(props) {
    const unitId = props.unitsByLocation && props.unitsByLocation[this.state.key];
    const unit = props.units[unitId];

    return unit || null;
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.state.unit && 
      nextProps.unitMoving &&
      nextProps.activeUnit.id === this.state.unit.id &&
      nextProps.intendedDestination &&
      !isEqual(nextProps.intendedDestination, this.state.location)
    ) {

      // 1. Remove the unit at this location
      this.context.io.emit('setUnitLocation', null, this.state.location)

      // 2. Move the unit to the new place (at some point we'll need to make sure it's successful)
      this.context.io.emit('setUnitLocation', nextProps.activeUnit.id, nextProps.intendedDestination)

      // 3. Since we're using the active Unit here, we need to update it's location
      // We don't need to emit this one becuase the other player doesn't see the active unit
      this.props.setActiveUnit(nextProps.activeUnit.id, nextProps.intendedDestination);

      // 4. Null out intent, moving,
      // no need to emit 
      this.props.setDestinationIntent(null);
      this.props.setMoveMode(false);
    }

    const unit = this.getUnit(nextProps);
    const highlight = this.inRange(nextProps, this.state)
    
    this.setState({
      unit,
      highlight
    })
  }



  shouldComponentUpdate(nextProps, nextState) {
    const nextUnit = this.getUnit(nextProps);

    if (
      nextUnit && this.state.unit === null ||
      (nextUnit && this.state.unit && !isEqual(this.state.unit, nextUnit)) ||
      this.state.hover !== nextState.hover ||
      this.inRange(nextProps, nextState) ||
      this.props.unitsByLocation[this.state.key] !== nextProps.unitsByLocation[nextState.key] ||
      (this.state.highlight && this.props.unitMoving !== nextProps.unitMoving)
    ) {
      return true;
    }
    return false;
  }

  inRange(props, state) {
    if (!props.unitMoving || !props.activeUnit.location) return false;

    // at some point we'll have to pass in the moving unit's mobility prop, but for now
    const movingUnitLocation = props.activeUnit.location;
    const movement = props.units[props.activeUnit.id].mobility; 

    // both x AND y have to be less than movement
    const xValid = Math.abs(state.location.x - movingUnitLocation.x) <= movement
    const yValid = Math.abs(state.location.y - movingUnitLocation.y) <= movement
    
    return xValid && yValid;
  }

  onClick(event) {
    if (this.props.unitMoving) {
      if (this.inRange(this.props, this.state)) {
        this.props.setDestinationIntent(this.state.location)  
      } else {
        return
      }
    } else {
      this.props.setActiveUnit(null, null)
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
    let classes = "square";

    if (this.state.highlight) {
      classes += " highlight"
    }

    if (this.state.hover && !this.state.unit) {
      classes += " hover"
    }

    // console.log('square render with unit: ', this.state.unit)

    return (
      <div 
        className={classes}
        onClick={this.onClick} 
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}>
        <span>
          {this.props.square.x}
          {this.props.square.y}
        </span>
        {this.state.unit && <Unit unit={this.state.unit} location={this.state.location} />}
      </div>
    );
  }
}

Square.contextTypes = {
  io: PropTypes.object
};


export default connect(mapStateToProps, mapDispatchToProps)(Square);
