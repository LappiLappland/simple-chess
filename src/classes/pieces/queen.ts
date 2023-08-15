import Cell from "../cell";
import { CELL_COLORS } from "../colors";
import Piece from "./piece";
import { PIECES_NAMES } from "./piece";

export default class Queen extends Piece {
  constructor(
    cell: Cell,
    color: CELL_COLORS,
  ) {
    super(cell, color);
    this.name = PIECES_NAMES.QUEEN;
    const colorLetter = color === CELL_COLORS.COLOR_BLACK ? 'b' : 'w';
    this.img = `/pieces/${colorLetter}_queen.svg`;
  }

  public getAvailableMoves() {
    const vert = this.cell.getFreeVertical(this.color);
    const hori = this.cell.getFreeHorizontal(this.color);
    const diag = this.cell.getFreeDiagonal(this.color);

    return this.filterOutOwn([vert, hori, diag]);
  }

  public setAvailableMoves() {
    const vert = this.cell.getFreeVertical(this.color);
    const hori = this.cell.getFreeHorizontal(this.color);
    const diag = this.cell.getFreeDiagonal(this.color);

    this.setAvailableForArrays([vert, hori, diag]);
  }

}