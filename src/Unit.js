import React, { Component } from 'react';
import {connect} from 'react-redux';
import {addUnit, removeUnit, setActiveUnit} from './actions';

// TODO: Not sure about these dispatch patterns
const mapDispatchToProps = dispatch => ({
  addUnit: (unit, location) => dispatch(addUnit(unit, location)),
  removeUnit: (unit, location) => dispatch(removeUnit(unit, location)),
  setActiveUnit: unit => dispatch(setActiveUnit(unit))
})

class Unit extends Component {

  constructor(props) {
    super(props);
    
    this.onClick = this.onClick.bind(this);
  }

  componentWillUnmount() {
    console.log('goodbye!')
  }

  onClick(event) {
    event.stopPropagation();
    this.props.setActiveUnit(this.props.unit)
  }

  render() {
    console.log(this.props)
    return(
      <div className="unit" onClick={this.onClick}>
        {this.props.unit.symbol}
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(Unit);