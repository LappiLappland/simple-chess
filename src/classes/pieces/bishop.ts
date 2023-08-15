import Cell from "../cell";
import { CELL_COLORS } from "../colors";
import Piece, { PIECES_NAMES } from "./piece";

export default class Bishop extends Piece {
  constructor(
    cell: Cell,
    color: CELL_COLORS,
  ) {
    super(cell, color);
    this.name = PIECES_NAMES.BISHOP;
    const colorLetter = color === CELL_COLORS.COLOR_BLACK ? 'b' : 'w';
    this.img = `/pieces/${colorLetter}_bishop.svg`;
  }

  public getAvailableMoves() {
    const diag = this.cell.getFreeDiagonal(this.color);

    return this.filterOutOwn([diag]);
  }

  public setAvailableMoves() {
    const diag = this.cell.getFreeDiagonal(this.color);

    this.setAvailableForArrays([diag]);
  }

}