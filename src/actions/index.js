
export const updateState = state => {
  console.log('updateState called')
  return {
    type: 'SOCKET_STATE',
    payload: state
  }
}

export const setActiveUnit = (id, location) => {
  return {
    type: 'SET_ACTIVE_UNIT',
    payload: {id, location}
  }
}

export const setMoveMode = bool => {
  return {
    type: 'SET_MOVE_ACTIVE',
    payload: bool
  }
}

export const setDestinationIntent = location => {
  return {
    type: 'SET_DESTINATION_INTENT',
    payload: location
  }
}

export const setAttackingUnit = id => {
  return {
    type: 'SET_ATTACKING_UNIT',
    payload: id
  }
}

// Hmm... we probably will need Turn here
