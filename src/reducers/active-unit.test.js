import reducer from './activeUnit'; // <- rename that file

describe('accive-unit reducer', () => {
  it('returns default state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('handles action SET_ACTIVE_UNIT with payload', () => {
    const action = {
      type: 'SET_ACTIVE_UNIT',
      payload: {
        id: '123',
        location: {x: 1, y: 1}
      }
    };

    const expectedState = {
      id: '123',
      location: {x: 1, y: 1}
    };

    expect(reducer({}, action)).toEqual(expectedState);
  });
});

// const activeUnit = (state = {}, action) => {
//   switch (action.type) {
//     case 'SET_ACTIVE_UNIT':
//       // TODO: check for team ID before
//       return {
//         id: action.payload.id,
//         location: action.payload.location
//       };

//     default:
//       return state;
//   }
// };

// export default activeUnit;
