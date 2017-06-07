let nextUnitId = 0;

export const addUnit = (unit, location) => {
  return {
    type: 'ADD_UNIT',
    location,
    payload: {
      id: nextUnitId++,
      ...unit
    }
  }
}

export const removeUnit = (unit, location) => {
  return {
    type: 'REMOVE_UNIT',
    location,
    payload: unit
  }
}

export const setActiveUnit = unit => {
  return {
    type: 'SET_ACTIVE_UNIT',
    payload: unit
  }
}