import React, { Component } from 'react';
import {connect} from 'react-redux';
import io from 'socket.io-client';
import {
  // addUnit,
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
  // addUnit: unit => dispatch(addUnit(unit)),
  updateUnit: (id, updates) => dispatch(updateUnit(id, updates)),
  setActiveUnit: (id, location)=> dispatch(setActiveUnit(id, location)),
  setUnitLocation: (id, location) => dispatch(setUnitLocation(id, location)),
  setAttackingUnit: id => dispatch(setAttackingUnit(id))
})


const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

class Unit extends Component {

  constructor(props) {
    super(props);
    
    this.onClick = this.onClick.bind(this);

    this.io = io('http://localhost:8080');

    this.io.on('setActiveUnit', (unitId, location) => {
      this.props.setActiveUnit(unitId, location);
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.unit.health > 0 && nextProps.unit.health <= 0) {
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
    // NOTE: Recall teh DND article
    // Units should probably have "hitPoints" or "attackPoints" to represent
    // their baseline number for damage they can cause. 
    // For now though, we'll just randomly halve the hit points

    const random = getRandomInt(1, this.props.unit.maxHealth / 2);
    const newHealth = this.props.unit.health - random;

    console.log('Random: ', random, 'newHealth: ', newHealth)

    this.props.updateUnit(this.props.unit.id, {
      health: newHealth
    })

    this.props.setAttackingUnit(null);
  }

  onClick(event) {
    event.stopPropagation();

    // NOTE: will need to think about teams here

    // NOTE: Attacking unit information seems useless, but attacking unit 
    // may not always be the active unit (for the enemny, or player 2)

    if (
      this.props.unit &&
      this.props.attackingUnitId &&
      this.props.attackingUnitId !== this.props.unit.id
    ) {
      this.battle();
    } else {
      this.io.emit('setActiveUnit', this.props.unit.id, this.props.location);
      // this.props.setActiveUnit(this.props.unit.id, this.props.location);
    }
  }

  render() {
    console.log('unit render')

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