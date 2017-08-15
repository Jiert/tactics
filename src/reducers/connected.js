const connected = (state = false, action) => {
  switch (action.type) {
    case 'SERVER_CONNECT':
      return true;
    default:
      return state;
  }
};

export default connected;
