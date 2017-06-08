
export const addUnit = (unit, location) => {
  return {
    type: 'ADD_UNIT',
    payload: {unit, location}
  }
}

export const removeUnit = (unit, location) => {
  return {
    type: 'REMOVE_UNIT',
    payload: {unit, location}
  }
}

export const setActiveUnit = unit => {
  return {
    type: 'SET_ACTIVE_UNIT',
    payload: unit
  }
}

export const setUnitLocation = (unit, location) => {
  return {
    type: 'SET_UNIT_LOCATION',
    payload: {unit, location}
  }
}