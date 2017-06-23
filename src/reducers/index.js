import move from './move';
import turn from './turn';
import units from './units';
import activeUnit from './activeUnit';
import unitsByLocation from './units-by-location';
import {combineReducers} from 'redux';

const battleApp = combineReducers({
  move,
  turn,
  units,
  activeUnit,
  unitsByLocation
})

export default battleApp;
