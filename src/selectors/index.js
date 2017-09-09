import {createSelector} from 'reselect';

export const getUnitIdAtLocation = (state, props) => {
  return state.unitsByLocation[props.location];
};

export const getUnitAtLocation = (state, props) => {
  // Get the Unit at this location
  return state.units[state.unitsByLocation[props.location]];
};

// NOTE: Should I just get rid of unit's by location and put units in squares?

// getUnit(props) {
//   const unitId = props.unitsByLocation && props.unitsByLocation[this.key];
//   const unit = props.units[unitId];

//   return unit || null;
// }
