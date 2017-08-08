const opponent = (state = {}, action) => {
  switch (action.type) {  
    case 'ADD_OPPONENT':
      // NOTE: This is set locally, and there can only be one
      return {...action.payload}
      

    default:
      return state
  }
}

export default opponent;