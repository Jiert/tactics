const units = (state = {}, action) => { 
  switch (action.type) {  
    case 'ADD_UNIT':
      return {
        ...state,
        [action.payload.unit.id]: action.payload.unit
      }

    // This reads exactly as the one above...
    // case 'UPDATE_UNIT':
    //   return {
    //     ...state,
    //     [action.payload.id]: action.payload
    //   } 

    default:
      return state
  }
};

export default units;