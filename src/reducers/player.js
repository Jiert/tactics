const players = (state = [], action) => {
  switch (action.type) {  
    case 'ADD_PLAYER':
      // TODO: Checking existing users before we add new

      return [
        ...state,
        action.payload
      ] 
      // return {
      //   id: action.payload.id,
      //   location: action.payload.location
      // }

    default:
      return state
  }
}

export default players;
