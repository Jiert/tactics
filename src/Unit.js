import React, { Component } from 'react';
import {connect} from 'react-redux';
import {
  addUnit, 
  removeUnit, 
  setActiveUnit,
  setAttackTarget
} from './actions';

const mapStateToProps = state => ({
  activeUnit: state.activeUnit,
  attackingUnit: state.move.attacking
});

// TODO: Not sure about these dispatch patterns
const mapDispatchToProps = dispatch => ({
  setAttackTarget: id => dispatch(setAttackTarget(id)),
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

  attackUnit() {
    // do I need to set the attack target? Or ccan I just run the attack?

    // At some point here we'll need to update Units

  }

  onClick(event) {
    event.stopPropagation();

    // we're gonna need more logic here for when we have teams, but for now
    if (
      this.props.unit &&
      this.props.attackingUnit &&
      this.props.attackingUnit.id !== this.props.unit.id
    ) {
      // then we have an attack
      console.log('ATTACK!!!')
    } else {
      this.props.setActiveUnit(this.props.unit)
    }
  }

  render() {
    const percent = (this.props.unit.health / this.props.unit.hitPoints) * 100;
    const healthStyle = {
      width: `${percent}%`
    }

    let classes = "unit";

    if (
      this.props.unit && 
      this.props.activeUnit && 
      this.props.unit.id === this.props.activeUnit.id
    ) {
      classes += " active";
    }

    return(
      <div className={classes} onClick={this.onClick}>
        <div className="unit-health-container">
          <div className="unit-health" style={healthStyle}></div>
        </div>
        {this.props.unit.symbol}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Unit);