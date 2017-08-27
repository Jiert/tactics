/* eslint-env jest */
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
