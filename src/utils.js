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

export const inRange = (pointA, pointB, maxDistance) => {
  const xValid = Math.abs(pointA.x - pointB.x) <= maxDistance;
  const yValid = Math.abs(pointA.y - pointB.y) <= maxDistance;

  return xValid && yValid;
};
