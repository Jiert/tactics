const unitsByLocation = (state = {}, action) => {
  switch (action.type) {
    case 'SET_UNIT_LOCATION':
      const location = action.payload.location;
      const coords = `${location.x}${location.y}`;
      // debugger;

      return {
        ...state,
        [coords]: action.payload.unit.id
      };

    default:
      return state;
  }
}

export default unitsByLocation;
