export const createNewWarrior = () => ({
  id: new Date().toISOString(),
  name: 'Warrior',
  hitPoints: 10,
  symbol: '⚔'
})