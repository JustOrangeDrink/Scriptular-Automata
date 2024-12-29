import { gridToWorld, worldToGrid, randomMinMax } from "./utilities.mjs";

const screen_width = document.getElementsByClassName("width_input")[0].value;
const screen_height = document.getElementsByClassName("height_input")[0].value;

const tile = 6;

const renderingSpeedInput = document.getElementsByClassName(
  "rendering_speed_input"
)[0];

const cellsAmount =
  document.getElementsByClassName("cells_amount_input")[0].value;

const spawnButton = document.getElementsByClassName("spawn_button")[0];
const killButton = document.getElementsByClassName("kill_button")[0];

const WIDTH =
  tile *
  Math.floor(
    ((document.getElementsByClassName("simulation")[0].offsetWidth / 100) *
      screen_width) /
      tile
  );
const HEIGHT =
  tile *
  Math.floor(
    ((document.getElementsByClassName("simulation")[0].offsetHeight / 100) *
      screen_height) /
      tile
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
console.log(grid);

renderLife();
function renderLife() {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].state == "alive") {
      let colorR = randomMinMax(0, 150);
      let colorG = randomMinMax(215, 255);
      let colorB = randomMinMax(215, 255);
      context.fillStyle = `rgb(${colorR}, ${colorG}, ${colorB})`;
      context.fillRect(
        gridToWorld(grid[i].x),
        gridToWorld(grid[i].y),
        tile,
        tile
      );
    } else {
      context.fillStyle = "#000000";
      context.fillRect(
        gridToWorld(grid[i].x),
        gridToWorld(grid[i].y),
        tile,
        tile
      );
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
      for (let neighbor in neighbors) {
        let index = neighbors[neighbor];
        if (index < 0) {
          index = grid.length + index;
        }
        if (index > grid.length - 1) {
          index = index - grid.length;
        }
        if (!grid[index]) {
          throw new Error("Index isn't in grid!");
        }
        grid[index].aliveNeighbors++;
      }
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

function spawnGeneration(cellsAmount) {
  for (let i = 0; i < cellsAmount; i++) {
    let randomIndex = randomMinMax(0, grid.length - 1);
    grid[randomIndex].state = "alive";
  }
  renderLife();
}

function killGeneration() {
  for (let i = 0; i < grid.length; i++) {
    grid[i].state = "dead";
  }
}

function iterateLife() {
  countNeighbors();
  for (let i = 0; i < grid.length; i++) {
    let tile = grid[i];
    let neighborsAmount = tile.aliveNeighbors;
    if (neighborsAmount == 3) {
      grid[i].state = "alive";
    }
    if (neighborsAmount < 2 || neighborsAmount > 3) {
      grid[i].state = "dead";
    }
  }
  renderLife();
}
setInterval(() => {
  iterateLife();
}, renderingSpeedInput.value);

spawnButton.onclick = function () {
  spawnGeneration(cellsAmount);
  renderLife();
};
killButton.onclick = function () {
  killGeneration();
};
