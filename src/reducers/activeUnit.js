const activeUnit = (state = {}, action) => {
  switch (action.type) {  
    case 'SET_ACTIVE_UNIT':
      return {
        ...action.payload
      }

    default:
      return state
  }
}

export default activeUnit;