import React, { Component } from 'react';
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
      this.props.setUnitLocation(null, this.state.location)

      // 2. Move the unit to the new place (at some point we'll need to make sure it's successful)
      this.props.setUnitLocation(nextProps.activeUnit.id, nextProps.intendedDestination)

      // 3. Since we're using the active Unit here, we need to update it's location 
      // At some point perhapss we could path the active unit, but for right now I'm just coing 
      // to call it again
      this.props.setActiveUnit(nextProps.activeUnit.id, nextProps.intendedDestination);

      // 4. Null out intent, moving, 
      this.props.setDestinationIntent(null);
      this.props.setMoveMode(false);
    }

    const unit = this.getUnit(nextProps);
    const highlight = this.shouldHighlightForMoveRange(nextProps, this.state)
    
    this.setState({
      unit,
      highlight
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    // need to prevent renders if units are equal
    const nextUnit = this.getUnit(nextProps);

    // Need to experimentw with this shit.

    if (
      (nextUnit && !isEqual(this.state.unit, nextUnit)) || 
      this.state.hover !== nextState.hover ||
      this.shouldHighlightForMoveRange(nextProps, nextState) ||
      (this.state.highlight && this.props.unitMoving !== nextProps.unitMoving)
    ) {
      return true;
    }
    return false;
  }

  shouldHighlightForMoveRange(props, state) {
    if (!props.unitMoving || !props.activeUnit.location) return false;

    // at some point we'll have to pass in the moving unit's mobility prop, but for now
    const movingUnitLocation = props.activeUnit.location;
    const movement = 2;

    // both x AND y have to be less than movement
    const xValid = Math.abs(state.location.x - movingUnitLocation.x) <= movement
    const yValid = Math.abs(state.location.y - movingUnitLocation.y) <= movement
    
    return xValid && yValid;
  }

  onClick(event) {
    if (this.props.unitMoving) {
      this.props.setDestinationIntent(this.state.location)
    } else {
      // NOt sure this is the buest place but
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

export default connect(mapStateToProps, mapDispatchToProps)(Square);
