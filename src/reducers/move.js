const initialState = {
  mode: false,
  intendedDestination: null
};


const move = (state = initialState, action) => {
  switch (action.type) {  
    case 'SET_MOVE_ACTIVE':
      return {
        ...state,
        mode: action.payload
      }

    case 'SET_DESTINATION_INTENT':
      return {
        ...state,
        intendedDestination: action.payload
      }
      
    default:
      return state
  }
}

export default move;