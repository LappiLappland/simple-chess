import Cell from "../cell";
import { CELL_COLORS } from "../colors";
import Piece from "./piece";
import { PIECES_NAMES } from "./piece";

export default class Pawn extends Piece {

  private hasMoved: boolean = false;

  constructor(
    cell: Cell,
    color: CELL_COLORS,
  ) {
    super(cell, color);
    this.name = PIECES_NAMES.PAWN;
    const colorLetter = color === CELL_COLORS.COLOR_BLACK ? 'b' : 'w';
    this.img = `/pieces/${colorLetter}_pawn.svg`;
  }

  public getAvailableMoves() {

    const moves: Cell[] = [];

    const color = this.color === CELL_COLORS.COLOR_BLACK ? 1 : -1;

    //Move forward
    const oneCell = this.cell.board.getCell(this.cell.x, this.cell.y + color*1)
    if (oneCell && oneCell.isEmpty()) {
      moves.push(oneCell);
      if (!this.hasMoved) {
        const twoCell = this.cell.board.getCell(this.cell.x, this.cell.y + color*2)
        if (twoCell && twoCell.isEmpty()) {
          moves.push(twoCell)
        }
      }
    }
    //Eat to the left and to the right
    const leftCell = this.cell.board.getCell(this.cell.x - 1, this.cell.y + color*1)
    if (leftCell && !leftCell.isEmpty()
    && leftCell.piece!.color !== this.color) {
      moves.push(leftCell)
    }
    const rightCell = this.cell.board.getCell(this.cell.x + 1, this.cell.y + color*1)
    if (rightCell && !rightCell.isEmpty()
    && rightCell.piece!.color !== this.color) {
      moves.push(rightCell)
    }

    return moves;
  }

  public setAvailableMoves() {

    const color = this.color === CELL_COLORS.COLOR_BLACK ? 1 : -1;

    //Eat to the left and to the right
    const leftCell = this.cell.board.getCell(this.cell.x - 1, this.cell.y + color*1)
    if (leftCell) {
      if (this.color === CELL_COLORS.COLOR_BLACK) {
        leftCell.occupiedBlack = true;
      } else {
        leftCell.occupiedWhite = true;
      }
    }
    const rightCell = this.cell.board.getCell(this.cell.x + 1, this.cell.y + color*1)
    if (rightCell) {
      if (this.color === CELL_COLORS.COLOR_BLACK) {
        rightCell.occupiedBlack = true;
      } else {
        rightCell.occupiedWhite = true;
      }
    }
  }

  public setPos(pos: Cell) {
    this.hasMoved = true;
    return super.setPos(pos);
  }

}