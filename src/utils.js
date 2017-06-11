export const createNewWarrior = () => ({
  id: new Date().toISOString(),
  name: 'Warrior',
  maxHealth: 10,
  health: 10,
  symbol: '⚔'
})