class Ship {
  constructor(type, size, id) {
    this.type = type;
    this.size = size;
    this.id = id;
    this.hits = 0;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits === this.size;
  }
}

class ShipPlacer {
  constructor(size, grids, ships) {
    this.size = size;
    this.grids = grids;
    this.ships = ships;
  }

  placeShips() {
    const shipTypes = [
      { id: 1, type: "Battleship", size: 5 },
      { id: 2, type: "Destroyer", size: 4 },
      { id: 3, type: "Destroyer", size: 4 },
    ];

    shipTypes.forEach((shipType) => this.deploySingleShip(shipType));
  }

  deploySingleShip(shipType) {
    let direction = Math.random() < 0.5 ? "horizontal" : "vertical";
    let x, y;

    do {
      x = Math.floor(Math.random() * this.size);
      y = Math.floor(Math.random() * this.size);
    } while (!this.isValidPlacement(x, y, shipType.size, direction));

    for (let i = 0; i < shipType.size; i++) {
      if (direction === "horizontal") {
        this.grids[x + i][y].id = shipType.id;
      } else {
        this.grids[x][y + i].id = shipType.id;
      }
    }

    this.ships.push(new Ship(shipType.type, shipType.size, shipType.id));
  }

  isValidPlacement(x, y, size, direction) {
    return (
      this.isWithinGrid(x, y, size, direction) &&
      this.isPositionEmpty(x, y, size, direction)
    );
  }

  isWithinGrid(x, y, size, direction) {
    if (direction === "horizontal") {
      return x + size <= this.size;
    } else {
      return y + size <= this.size;
    }
  }

  isPositionEmpty(x, y, size, direction) {
    for (let i = 0; i < size; i++) {
      if (direction === "horizontal") {
        if (this.grids[x + i][y].id !== null) {
          return false;
        }
      } else {
        if (this.grids[x][y + i].id !== null) {
          return false;
        }
      }
    }
    return true;
  }
}

class ShotProcessor {
  constructor(grids, ships) {
    this.grids = grids;
    this.ships = ships;
  }

  receiveShot(x, y) {
    const cell = this.grids[x][y];
    if (cell.status !== "empty") {
      alert("You already shot at this position!");
      return;
    }
    if (cell.id !== null) {
      this.processHit(cell, x, y);
    } else {
      this.processMiss(cell, x, y);
    }
  }

  processHit(cell, x, y) {
    cell.status = "hit";
    const ship = this.ships.find((s) => s.id === cell.id);
    ship.hit();
    alert(`Hit ${ship.type}!`);
    if (ship.isSunk()) {
      alert(`You sank the ${ship.type}!`);
    }
    this.renderShotResult(x, y, cell.status);

    const gameEnded = this.ships.every((ship) => ship.isSunk());
    if (gameEnded) {
      alert("Congratulations! You sunk all the ships!");
    }
  }

  processMiss(cell, x, y) {
    cell.status = "miss";
    alert("Miss!");
    this.renderShotResult(x, y, cell.status);
  }

  renderShotResult(x, y, status) {
    const cell = document.getElementById("board").rows[x].cells[y];
    cell.classList.add(status === "hit" ? "hit" : "miss");
  }
}

class Board {
  constructor(size, grids, ships) {
    this.size = size;
    this.grids = grids;
    this.shotProcessor = new ShotProcessor(grids, ships);
  }

  renderBoard() {
    const table = document.getElementById("board");
    for (let i = 0; i < this.size; i++) {
      const row = table.insertRow(i);
      this.grids[i] = [];
      for (let j = 0; j < this.size; j++) {
        row.insertCell(j);
        this.grids[i][j] = { id: null, status: "empty" };
      }
    }
    this.handleClick(table);
  }

  handleClick(table) {
    // Event delegation by attaching a single event listener to the entire board instead of attaching individual event listeners to each cell.
    // This approach reduces the number of event listeners attached to individual cells, improving performance especially for large game boards, and simplifies the code.
    table.addEventListener("click", (event) => {
      const cell = event.target;
      const rowIndex = cell.parentNode.rowIndex;
      const cellIndex = cell.cellIndex;
      this.shotProcessor.receiveShot(rowIndex, cellIndex);
    });
  }
}

class BattleShips {
  constructor() {
    this.size = 10;
    this.grids = [];
    this.ships = [];
  }

  startGame() {
    this.board = new Board(this.size, this.grids, this.ships);
    this.board.renderBoard();
    this.shipPlacer = new ShipPlacer(this.size, this.grids, this.ships);
    this.shipPlacer.placeShips();
  }
}

const battleShipsBoard = new BattleShips();
battleShipsBoard.startGame();
