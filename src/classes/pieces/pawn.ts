import Cell from "../cell";
import { CELL_COLORS } from "../colors";
import { SpecialMoves } from "../history";
import Piece, { PIECES_NAMES } from "./piece";

export default class Pawn extends Piece {

  private hasMoved: boolean = false;
  public hasJustDoubleMoved: boolean = false;

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
    //En Passant to the left and to the right
    const leftCell = this.cell.board.getCell(this.cell.x - 1, this.cell.y + color*1)
    if (leftCell && leftCell.piece?.color !== this.color) {
      const leftPassant = this.cell.board.getCell(leftCell.x, leftCell.y - color*1)
      if ((!leftCell.isEmpty()
      && leftCell.piece!.color !== this.color)
      || (leftCell.isEmpty()
      && leftPassant
      && leftPassant.piece instanceof Pawn
      && leftPassant.piece.hasJustDoubleMoved
      )) {
        moves.push(leftCell);
      }
    }

    const rightCell = this.cell.board.getCell(this.cell.x + 1, this.cell.y + color*1)
    if (rightCell && rightCell.piece?.color !== this.color) {
      const leftPassant = this.cell.board.getCell(rightCell.x, rightCell.y - color*1)
      if ((!rightCell.isEmpty()
      && rightCell.piece!.color !== this.color)
      || (rightCell.isEmpty()
      && leftPassant
      && leftPassant.piece instanceof Pawn
      && leftPassant.piece.hasJustDoubleMoved
      )) {
        moves.push(rightCell);
      }
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
    let event;
    if (!this.hasMoved) {
      event = () => {this.hasMoved = false};
      if (Math.abs(pos.y - this.cell.y) === 2) {
        this.hasJustDoubleMoved = true;
      }
    }
    else if (this.hasMoved) {
      this.hasJustDoubleMoved = false;
    }
    this.hasMoved = true;

    const color = this.color === CELL_COLORS.COLOR_BLACK ? 1 : -1;
    const cellBehind = this.cell.board.getCell(pos.x, pos.y - color*1);
    const moveWasVertical = pos.x === this.cell.x;
    const wasPassant = cellBehind && cellBehind.piece
                    && cellBehind.piece instanceof Pawn
                    && !pos.piece
                    && !moveWasVertical;
    
    if (wasPassant) {
      const pawnBehind = cellBehind.piece;
      pawnBehind!.teleportPos(pos);
    }

    const history = super.setPos(pos);
    history.extraEvent = event;
    if (wasPassant) history.specialMove = SpecialMoves.Passant;

    if (pos.y === 7 || pos.y === 0) {
      history.specialMove = SpecialMoves.Promotion;
    }

    return history;
  }

}
