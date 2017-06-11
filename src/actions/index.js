
export const addUnit = unit => {
  return {
    type: 'ADD_UNIT',
    payload: unit
  }
}

export const updateUnit = (id, updates) => {
  return {
    type: 'UPDATE_UNIT',
    payload: {id, updates}
  }
}

// export const removeUnit = (unit, location) => {
//   return {
//     type: 'REMOVE_UNIT',
//     payload: {unit, location}
//   }
// }

export const setActiveUnit = unit => {
  return {
    type: 'SET_ACTIVE_UNIT',
    payload: unit
  }
}

export const setUnitLocation = (id, location) => {
  return {
    type: 'SET_UNIT_LOCATION',
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

export const setAttackTarget = bool => {
  return {
    type: 'SET_ATTACK_TARGET',
    payload: bool
  }
}