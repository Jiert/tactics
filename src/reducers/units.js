const $ = (a, b) => (`${a}${b}`);

const units = (state = {}, action) => {
  const selector = action.location && $(action.location.x, action.location.y);
  
  switch (action.type) {  
    case 'ADD_UNIT':
      return {
        ...state,
        [selector]: action.payload
      }

    case 'REMOVE_UNIT':
      return {
        ...state,
        [selector]: null
      } 

    default:
      return state
  }
};

export default units;