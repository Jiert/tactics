import React, { Component } from 'react';
import {connect} from 'react-redux';
import {
  addUnit,
  updateUnit,
  setActiveUnit,
  setUnitLocation,
  setAttackingUnit
} from './actions';

const mapStateToProps = state => ({
  units: state.units,
  activeUnit: state.activeUnit,
  attackingUnitId: state.move.attackingUnitId,
  unitsByLocation: state.unitsByLocation
});

// TODO: Not sure about these dispatch patterns
const mapDispatchToProps = dispatch => ({
  addUnit: unit => dispatch(addUnit(unit)),
  updateUnit: (id, updates) => dispatch(updateUnit(id, updates)),
  setActiveUnit: (id, location)=> dispatch(setActiveUnit(id, location)),
  setUnitLocation: (id, location) => dispatch(setUnitLocation(id, location)),
  setAttackingUnit: id => dispatch(setAttackingUnit(id))
})


function getRandomInt(min, max) {
  // min = Math.ceil(min);
  // max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
  // return Math.floor(Math.random() * (10 - 0));
}

class Unit extends Component {

  constructor(props) {
    super(props);
    
    this.onClick = this.onClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.unit.health <= 0) {
      this.perish();
    }
  }

  componentWillUnmount() {
    console.log('goodbye!')
  }

  perish() {
    console.log('I regret nothing')

    // 1: Set (or delete) this unit's id from the location map
    this.props.setUnitLocation(null, this.props.location)

    // 2: Profit? Is that all?
  }

  battle() {
    // Going to have to put some thought into how we want to to do this here.
    // There's a lot to think about.
    // 1. Recall teh DND article
    // 2. Units should probably have "hitPoints" or "attackPoints" or whatever we want to call
    // Their baseline numnber for damage they can cause. Perhaps that's the number to have, not 
    // just halving the totaly hit  points
    const random = getRandomInt(1, this.props.unit.maxHealth / 2);
    const newHealth = this.props.unit.health - random;

    console.log('Random: ', random, 'newHealth: ', newHealth)

    this.props.updateUnit(this.props.unit.id, {
      health: newHealth
    })

    // this.props.updateUnit(this.props.attackingUnitId, {
    //   health: this.props.units[this.props.attackingUnitId].health - getRandomInt()
    // })

    this.props.setAttackingUnit(null);
  }

  onClick(event) {
    event.stopPropagation();

    // we're gonna need more logic here for when we have teams, but for now

    // TODO: Attacking unit information seems useless. Won't the attacking unit...
    // always be the active unit? NO! NOt for the enemny or AI, or maybe player 2. Hmm..

    if (
      this.props.unit &&
      this.props.attackingUnitId &&
      this.props.attackingUnitId !== this.props.unit.id
    ) {
      this.battle();
    } else {
      this.props.setActiveUnit(this.props.unit.id, this.props.location);
    }
  }

  render() {
    const percent = (this.props.unit.health / this.props.unit.maxHealth) * 100;
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