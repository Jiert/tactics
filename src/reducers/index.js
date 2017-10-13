import move from './move';
import turn from './turn';
import units from './units';
import players from './players';
import squares from './squares';
import opponent from './opponent';
import commander from './commander';
import connected from './connected';
import activeUnit from './activeUnit';
import activePlayer from './active-player';
import {combineReducers} from 'redux';

const battleApp = combineReducers({
  move,
  turn,
  units,
  players,
  squares,
  opponent,
  commander,
  connected,
  activeUnit,
  activePlayer
});

const rootReducer = (state, action) => {
  if (action.type === 'SOCKET_STATE') {
    const newState = {...state, ...action.payload};

    return battleApp(newState, action);
  }

  if (action.type === 'SERVER_DISCONNECT') {
    state = undefined;
  }

  return battleApp(state, action);
};

export default rootReducer;
