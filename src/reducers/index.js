import move from './move';
import turn from './turn';
import units from './units';
import players from './players';
import opponent from './opponent';
import commander from './commander';
import connected from './connected';
import activeUnit from './activeUnit';
import unitsByLocation from './units-by-location';
import {combineReducers} from 'redux';

const battleApp = combineReducers({
  move,
  turn,
  units,
  players,
  opponent,
  commander,
  connected,
  activeUnit,
  unitsByLocation
})

const rootReducer = (state, action) => { 
  if (action.type === 'SOCKET_STATE') {
    const newState = {...state, ...action.payload};

    return battleApp(newState, action);
  }

  if (action.type === 'SERVER_DISCONNECT') {
    state = undefined;
  }

  return battleApp(state, action);
}

export default rootReducer;
