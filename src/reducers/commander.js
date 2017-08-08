const commander = (state = {}, action) => {
  switch (action.type) {  
    case 'ADD_COMMANDER':
      // NOTE: This is set locally, and there can only be one
      return {...action.payload}
      

    default:
      return state
  }
}

export default commander;
