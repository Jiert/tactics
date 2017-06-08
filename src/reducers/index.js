import {combineReducers} from 'redux';
import units from './units';
import activeUnit from './activeUnit';
import unitsByLocation from './units-by-location';

const battleApp = combineReducers({
  units,
  activeUnit,
  unitsByLocation
})

export default battleApp;
