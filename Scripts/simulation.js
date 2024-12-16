import { gridToWorld, worldToGrid, randomMinMax } from "./utilities.mjs";

const screen_width = 100;
const screen_height = 100;

const renderingSpeed = document.getElementsByClassName(
  "rendering_speed_input"
)[0].value;

const cellsAmount =
  document.getElementsByClassName("cells_amount_input")[0].value;

const WIDTH =
  6 *
  Math.floor(
    ((document.getElementsByClassName("simulation")[0].offsetWidth / 100) *
      screen_width) /
      6
  );
const HEIGHT =
  6 *
  Math.floor(
    ((document.getElementsByClassName("simulation")[0].offsetHeight / 100) *
      screen_height) /
      6
  );
console.log("Width: " + WIDTH);
console.log("Height: " + HEIGHT);

const WIDTH_GRID = worldToGrid(WIDTH);
const HEIGHT_GRID = worldToGrid(HEIGHT);

const canvas = document.querySelector("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;

const context = canvas.getContext("2d");
context.font = "bold 16px serif";

const grid = [];
for (let x = 0; x < WIDTH_GRID; x++) {
  for (let y = 0; y < HEIGHT_GRID; y++) {
    let tile = {
      state: "dead",
      x: x,
      y: y,
      aliveNeighbors: 0,
    };
    grid.push(tile);
  }
}

function renderLife() {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].state == "alive") {
      context.fillStyle = "#33ccaa";
      context.fillRect(gridToWorld(grid[i].x), gridToWorld(grid[i].y), 6, 6);
    } else {
      context.fillStyle = "#000000";
      context.fillRect(gridToWorld(grid[i].x), gridToWorld(grid[i].y), 6, 6);
    }
  }
}

function countNeighbors() {
  for (let i = 0; i < grid.length; i++) {
    grid[i].aliveNeighbors = 0;
  }

  for (let i = 0; i < grid.length; i++) {
    if (grid[i].state == "alive") {
      let neighbors = getNeighborsIndex(i);
      for (let neighborIndex in neighbors) {
        if (grid[neighbors[neighborIndex]] == undefined) continue;
        grid[neighbors[neighborIndex]].aliveNeighbors++;
      }
    }
  }
}

function getGridIndexByCoordinates(x, y) {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].x == x && grid[i].y == y) {
      return i;
    }
  }
}

function getNeighborsIndex(core) {
  let directions = {
    LeftUp: core - HEIGHT_GRID - 1,
    Left: core - HEIGHT_GRID,
    LeftDown: core - HEIGHT_GRID + 1,
    Up: core - 1,
    Down: core + 1,
    RightUp: core + HEIGHT_GRID - 1,
    Right: core + HEIGHT_GRID,
    RightDown: core + HEIGHT_GRID + 1,
  };
  return directions;
}

console.log(grid);

renderLife();

function iterateLife() {
  countNeighbors();
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].aliveNeighbors == 3) {
      grid[i].state = "alive";
    }
    if (grid[i].aliveNeighbors < 2 || grid[i].aliveNeighbors > 3) {
      grid[i].state = "dead";
    }
  }
  renderLife();
}

for (let i = 0; i < cellsAmount; i++) {
  let randomIndex = randomMinMax(1, WIDTH_GRID * HEIGHT_GRID);
  grid[randomIndex].state = "alive";
}

setInterval(() => {
  iterateLife();
}, renderingSpeed);
