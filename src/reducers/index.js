import {combineReducers} from 'redux';
import units from './units';
import activeUnit from './activeUnit';
import unitsByLocation from './units-by-location';
import move from './move';

const battleApp = combineReducers({
  units,
  move,
  activeUnit,
  unitsByLocation
})

export default battleApp;
