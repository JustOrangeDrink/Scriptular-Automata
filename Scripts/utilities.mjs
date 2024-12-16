function worldToGrid(worldValue) {
  return Math.floor(worldValue / 6);
}

function gridToWorld(gridValue) {
  return gridValue * 6;
}

function randomMinMax(min, max) {
  return Math.floor(Math.random() * (max - min) + 1 + min);
}

export { worldToGrid, gridToWorld, randomMinMax };
