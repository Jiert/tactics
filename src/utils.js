export const createNewWarrior = () => ({
  id: new Date().toISOString(),
  name: 'Warrior',
  maxHealth: 10,
  health: 10,
  mobility: 2,
  symbol: '⚔'
})

export const createNewCastle = () => ({
  id: new Date().toISOString(),
  name: 'Castle',
  maxHealth: 100,
  health: 100,
  mobility: 0,
  symbol: '🏰'
})


