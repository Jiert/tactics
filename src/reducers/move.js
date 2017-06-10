const initialState = {
  mode: false,
  intendedDestination: null,
  // maybe not the best place for this, but 
  attackTarget: null,
  attacking: false
};


const move = (state = initialState, action) => {
  switch (action.type) {  
    case 'SET_MOVE_ACTIVE':
      return {
        ...state,
        mode: action.payload
      }

    case 'PREPARE_TO_ATTACK':
      return {
        ...state,
        attacking: action.payload
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