import Cell from "../cell";
import { CELL_COLORS } from "../colors";
import Piece from "./piece";
import { PIECES_NAMES } from "./piece";

export default class Rook extends Piece {

  hasMoved: boolean = false;

  constructor(
    cell: Cell,
    color: CELL_COLORS,
  ) {
    super(cell, color);
    this.name = PIECES_NAMES.ROOK;
    const colorLetter = color === CELL_COLORS.COLOR_BLACK ? 'b' : 'w';
    this.img = `/simple-chess/pieces/${colorLetter}_rook.svg`;
  }

  public getAvailableMoves() {
    const vert = this.cell.getFreeVertical(this.color);
    const hori = this.cell.getFreeHorizontal(this.color);

    if (this.cell.board.isKingUnderAttack(this.color)) {
      return []
    }

    return this.filterOutOwn([vert, hori]);
  }

  public setAvailableMoves() {
    const vert = this.cell.getFreeVertical(this.color);
    const hori = this.cell.getFreeHorizontal(this.color);

    this.setAvailableForArrays([vert, hori])
  }

  public setPos(pos: Cell) {
    this.hasMoved = true;
    return super.setPos(pos);
  }
}