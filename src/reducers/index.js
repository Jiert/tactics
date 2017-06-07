import {combineReducers} from 'redux';
import units from './units';
import activeUnit from './activeUnit';

const battleApp = combineReducers({
  units,
  activeUnit
})

export default battleApp;
