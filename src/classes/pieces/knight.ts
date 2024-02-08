import Cell from "../cell";
import { CELL_COLORS } from "../colors";
import Piece, { PIECES_NAMES } from "./piece";

export default class Knight extends Piece {
  constructor(
    cell: Cell,
    color: CELL_COLORS,
  ) {
    super(cell, color);
    this.name = PIECES_NAMES.KNIGHT;
    const colorLetter = color === CELL_COLORS.COLOR_BLACK ? 'b' : 'w';
    this.img = `/simple-chess/pieces/${colorLetter}_knight.svg`;
  }

  public getAvailableMoves() {
    const board = this.cell.board;
    const moves: Cell[] = [];

    const addCell = (xOffset: number, yOffset: number) => {
      const [x, y] = [this.cell.x + xOffset, this.cell.y + yOffset]
      if (board.cellExists(x, y)) {
        const cell = board.getCell(x, y)!;
        if (cell.piece?.color !== this.color)
          moves.push(cell);
      }
    }

    const lol = [2, -2, 1, -1]

    lol.forEach(first => {
      lol.forEach(second => {
        if (Math.abs(first) !== Math.abs(second))
          addCell(first, second)
      })
    })

    return moves;
  }

  public setAvailableMoves() {
    const board = this.cell.board;
    const moves: Cell[] = [];

    const addCell = (xOffset: number, yOffset: number) => {
      const [x, y] = [this.cell.x + xOffset, this.cell.y + yOffset]
      if (board.cellExists(x, y)) {
        const cell = board.getCell(x, y)!;
        if (this.color === CELL_COLORS.COLOR_BLACK) {
          cell.occupiedBlack = true;
        } else {
          cell.occupiedWhite = true;
        }
      }
    }

    const lol = [2, -2, 1, -1]

    lol.forEach(first => {
      lol.forEach(second => {
        if (Math.abs(first) !== Math.abs(second))
          addCell(first, second)
      })
    })

    return moves;
  }

}