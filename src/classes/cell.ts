import Board from "./board";
import { CELL_COLORS } from "./colors";
import Piece, { PIECES_NAMES } from "./pieces/piece";
import { History } from "./history";

export default class Cell {
  readonly x: number;
  readonly y: number;
  readonly color: CELL_COLORS;
  piece: Piece | null;
  board: Board;
  available: boolean;
  occupiedBlack: boolean;
  occupiedWhite: boolean;

  constructor(
    board: Board,
    x: number,
    y: number,
    color: CELL_COLORS,
    piece: Piece | null,
  ) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.color = color;
    this.piece = piece;
    this.available = false;
    this.occupiedBlack = false;
    this.occupiedWhite = false;
  }

  public isEmpty() {
    return this.piece === null;
  }

  public isNotBlockedVertical(to: Cell) {
    if (to.x !== this.x) {
      return false
    }

    const min = Math.min(this.y, to.y);
    const max = Math.max(this.y, to.y);
    for (let i = min + 1; i < max; i++) {
      const cell = this.board.getCell(this.x, i);
      if (!cell.isEmpty()) {
        return false;
      }
    }
    return true;
  }

  public isNotBlockedHorizontal(to: Cell) {
    if (to.y !== this.y) {
      return false
    }

    const min = Math.min(this.x, to.x);
    const max = Math.max(this.x, to.x);
    for (let i = min + 1; i < max; i++) {
      const cell = this.board.getCell(i, this.y);
      if (!cell.isEmpty()) {
        return false;
      }
    }
    return true;
  }

  public isNotBlockedDiagonal(to: Cell) {
    
    const absX = Math.abs(to.x - this.x);
    const absY = Math.abs(to.y - this.y);
    if (absX !== absY) return false
    
    const dY = this.y < to.y ? 1 : -1;
    const dX = this.x < to.x ? 1 : -1;

    for (let i = 1; i < absX; i++) {
      const cell = this.board.getCell(this.x + i*dX, this.y + i*dY);
      if (!cell.isEmpty()) {
        return false;
      }
    }

    return true;
  }

  public getFreeVertical(color: CELL_COLORS) {
    const x = this.x;
    const y = this.y;
    const freeCells: Cell[] = [];
    //up
    for (let i = y-1; i >= 0; i--) {
      const cell = this.board.getCell(x, i);
      freeCells.push(cell);
      if (cell.piece && cell.piece.name === PIECES_NAMES.KING && cell.piece.color !== color) {
        continue;
      } else if (cell.piece) {
        break;
      }
    }
    //down
    for (let i = y+1; i < this.board.getColumnLength(); i++) {
      const cell = this.board.getCell(x, i);
      freeCells.push(cell);
      if (cell.piece && cell.piece.name === PIECES_NAMES.KING && cell.piece.color !== color) {
        continue;
      } else if (cell.piece) {
        break;
      }
    }
    return freeCells;
  }

  public getFreeHorizontal(color: CELL_COLORS) {
    const x = this.x;
    const y = this.y;
    const freeCells: Cell[] = [];
    //up
    for (let i = x-1; i >= 0; i--) {
      const cell = this.board.getCell(i, y);
      freeCells.push(cell);
      if (cell.piece && cell.piece.name === PIECES_NAMES.KING && cell.piece.color !== color) {
        continue;
      } else if (cell.piece) {
        break;
      }
    }
    //down
    for (let i = x+1; i < this.board.getRowLength(); i++) {
      const cell = this.board.getCell(i, y);
      freeCells.push(cell);
      if (cell.piece && cell.piece.name === PIECES_NAMES.KING && cell.piece.color !== color) {
        continue;
      } else if (cell.piece) {
        break;
      }
    }
    return freeCells;
  }

  public getFreeDiagonal(color: CELL_COLORS) {
    const x = this.x;
    const y = this.y;
    const freeCells: Cell[] = [];
    
    let i;
    const lenRow = this.board.getRowLength();
    const lenCol = this.board.getColumnLength();

    //mid-to-topLeft
    i = 1;
    while (x-i >= 0 && y-i >= 0) {
      const cell = this.board.getCell(x-i, y-i);
      freeCells.push(cell);
      i++;
      if (cell.piece && cell.piece.name === PIECES_NAMES.KING && cell.piece.color !== color) {
        continue;
      } else if (cell.piece) {
        break;
      }
    }
    //mid-to-bottomLeft
    i = 1;
    while (x-i >= 0 && y+i < lenCol) {
      const cell = this.board.getCell(x-i, y+i);
      freeCells.push(cell);
      i++;
      if (cell.piece && cell.piece.name === PIECES_NAMES.KING && cell.piece.color !== color) {
        continue;
      } else if (cell.piece) {
        break;
      }
    }
    //mid-to-topRight
    i = 1;
    while (x+i < lenRow && y-i >= 0) {
      const cell = this.board.getCell(x+i, y-i);
      freeCells.push(cell);
      i++;
      if (cell.piece && cell.piece.name === PIECES_NAMES.KING && cell.piece.color !== color) {
        continue;
      } else if (cell.piece) {
        break;
      }
    }
    //mid-to-bottomRight
    i = 1;
    while (x+i < lenRow && y+i < lenCol) {
      const cell = this.board.getCell(x+i, y+i);
      freeCells.push(cell);
      i++;
      if (cell.piece && cell.piece.name === PIECES_NAMES.KING && cell.piece.color !== color) {
        continue;
      } else if (cell.piece) {
        break;
      }
    }

    return freeCells;
  }

  public movePieceTo(to: Cell) {
    const history = this.piece!.setPos(to);

    this.board.movesHistory.push(history)
  }

}