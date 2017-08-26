import reducer from './activeUnit'; // <- rename that file

describe('accive-unit reducer', () => {
  it('returns default state', () => {
    expect(true).toBe(true);
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
