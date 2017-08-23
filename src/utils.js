export const createNewWarrior = commanderId => ({
  id: Date.now(),
  name: 'Warrior',
  maxHealth: 10,
  health: 10,
  mobility: 2,
  // movesLeft: 0,
  movesLeft: 2, // <- setting at 2 for testing
  symbol: '⚔',
  commanderId
});

export const createNewCastle = commanderId => ({
  id: Date().now(),
  name: 'Castle',
  maxHealth: 100,
  health: 100,
  mobility: 0,
  symbol: '🏰',
  commanderId
});

export const distanceMoved = (prevLoc, currentLoc) => {
  const xDistance = Math.abs(prevLoc.x - currentLoc.x);
  const yDistance = Math.abs(prevLoc.y - currentLoc.y);

  return Math.max(xDistance, yDistance);
};
