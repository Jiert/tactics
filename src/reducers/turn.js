const turn = (state = 0, action) => {
  switch (action.type) {
    case 'FINISH_TURN': {
      return state + 1;
    }

    default:
      return state;
  }
};

export default turn;
