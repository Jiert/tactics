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
    this.props.setActiveUnit(this.props.unit)

    // This all works
    const location = `${window.prompt('location')}`
    this.props.addUnit(this.props.unit, {x: Number(location.slice(0, 1)), y: Number(location.slice(1, 2))})
    this.props.removeUnit(this.props.unit, this.props.location)
  }

  render() {
    console.log(this.props)
    return(
      <div onClick={this.onClick}>
        {this.props.unit.symbol}
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(Unit);