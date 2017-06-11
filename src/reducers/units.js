const units = (state = {}, action) => { 
  switch (action.type) {  
    case 'ADD_UNIT':
      return {
        ...state,
        [action.payload.id]: action.payload
      }

    case 'UPDATE_UNIT':
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload.updates
        }
      } 

    default:
      return state
  }
};

export default units;