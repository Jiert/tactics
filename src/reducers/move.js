const initialState = {
  mode: false,
  intendedDestination: null,
  // maybe not the best place for this, but
  attackTarget: null,
  attackingUnitId: null
};

const move = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MOVE_ACTIVE':
      return {
        ...state,
        mode: action.payload
      };

    case 'SET_ATTACKING_UNIT':
      return {
        ...state,
        attackingUnitId: action.payload
      };

    case 'SET_DESTINATION_INTENT':
      return {
        ...state,
        intendedDestination: action.payload
      };

    case 'CLEAR_ATTACKING_UNIT':
      return {
        ...state,
        attackingUnitId: null
      };

    default:
      return state;
  }
};

export default move;
