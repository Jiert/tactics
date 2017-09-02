export const distanceMoved = (prevLoc, currentLoc) => {
  const xDistance = Math.abs(prevLoc.x - currentLoc.x);
  const yDistance = Math.abs(prevLoc.y - currentLoc.y);

  return Math.max(xDistance, yDistance);
};

export const chance = () => Math.random() * (10 - 0) + 0 < 1.5;

// This is just an idea
export const generateTerrain = () => {
  // this is just for fun, the real terrain will have to be on the server
  if (this.chance()) {
    return '🌲';
  } else if (this.chance()) {
    return '⛰';
  }
};
