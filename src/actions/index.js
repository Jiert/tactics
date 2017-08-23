export const updateState = state => {
  console.log('updateState called');
  return {
    type: 'SOCKET_STATE',
    payload: state
  };
};

export const setActiveUnit = (id, location) => {
  return {
    type: 'SET_ACTIVE_UNIT',
    payload: {id, location}
  };
};

export const setMoveMode = bool => {
  return {
    type: 'SET_MOVE_ACTIVE',
    payload: bool
  };
};

export const setDestinationIntent = location => {
  return {
    type: 'SET_DESTINATION_INTENT',
    payload: location
  };
};

export const setAttackingUnit = id => {
  return {
    type: 'SET_ATTACKING_UNIT',
    payload: id
  };
};

export const addCommander = commander => ({
  type: 'ADD_COMMANDER',
  payload: commander
});

export const addOpponent = opponent => ({
  type: 'ADD_OPPONENT',
  payload: opponent
});

export const ioConnect = () => ({
  type: 'SERVER_CONNECT'
});

export const ioDisconnect = () => ({
  type: 'SERVER_DISCONNECT'
});
