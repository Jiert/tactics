import React, { Component } from 'react';
import {connect} from 'react-redux';
import {setUnitLocation, setDestinationIntent, setMoveMode} from './actions';
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
  setUnitLocation: (id, location) => dispatch(setUnitLocation(id, location)),
  setDestinationIntent: location => dispatch(setDestinationIntent(location))
});

class Square extends Component {
  constructor(props) {
    super(props);
    
    this.onClick = this.onClick.bind(this);

    this.state = {
      unit: null,
      key: `${props.square.x}${props.square.y}`,
      location: {
        x: props.square.x,
        y: props.square.y
      }
    }
  }

  getUnit(props) {
    const unitId = props.unitsByLocation && props.unitsByLocation[this.state.key];
    const unit = props.units[unitId];

    return unit;
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

      // 3. Null out intent, moving, 
      this.props.setDestinationIntent(null);
      this.props.setMoveMode(false);
    }

    const unit = this.getUnit(nextProps);
    this.setState({unit})
  }

  onClick(event) {
    if (this.props.unitMoving) {
      this.props.setDestinationIntent(this.state.location)
    }
  }

  render() {
    return (
      <div className="square" onClick={this.onClick}>
        <span>
          {this.props.square.x}
          {this.props.square.y}
        </span>
        {this.state.unit && <Unit unit={this.state.unit} location={this.location} />}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Square);
