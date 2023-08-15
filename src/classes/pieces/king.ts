import Cell from "../cell";
import { CELL_COLORS } from "../colors";
import { History, SpecialMoves } from "../history";
import Piece from "./piece";
import { PIECES_NAMES } from "./piece";
import Rook from "./rook";

export default class King extends Piece {

  hasMoved: boolean = false;

  constructor(
    cell: Cell,
    color: CELL_COLORS,
  ) {
    super(cell, color);
    this.name = PIECES_NAMES.KING;
    const colorLetter = color === CELL_COLORS.COLOR_BLACK ? 'b' : 'w';
    this.img = `/pieces/${colorLetter}_king.svg`;
  }

  public getAvailableMoves() {
    const board = this.cell.board;
    const moves: Cell[] = [];

    const addCell = (xOffset: number, yOffset: number) => {
      const [x, y] = [this.cell.x + xOffset, this.cell.y + yOffset]
      if (board.cellExists(x, y)) {
        const cell = board.getCell(x, y)

        if ((cell.occupiedBlack && this.color === CELL_COLORS.COLOR_WHITE)
          ||(cell.occupiedWhite && this.color === CELL_COLORS.COLOR_BLACK)) {
            return;
          }

        if (cell.piece?.color !== this.color)
          moves.push(board.getCell(x, y))
      }
    }

    const lol = [1, 0, -1]

    lol.forEach(first => {
      lol.forEach(second => {
        addCell(first, second)
      })
    })

    //Castle
    if (!this.hasMoved) {
      if ((this.color === CELL_COLORS.COLOR_BLACK && !this.cell.occupiedWhite)
      ||  (this.color === CELL_COLORS.COLOR_WHITE && !this.cell.occupiedBlack)) {

        const hori = this.cell.getFreeHorizontal(this.color);

        hori.forEach(cell => {
          if (cell.piece && cell.piece instanceof Rook && !cell.piece.hasMoved) {
            const delta = this.cell.x - cell.x;
            const coef = delta < 0 ? -1 : 1;
            const kingCell = this.cell.board.getCell(cell.x+1*coef, cell.y);
            if ((this.color === CELL_COLORS.COLOR_BLACK && !kingCell.occupiedWhite)
            ||  (this.color === CELL_COLORS.COLOR_WHITE && !kingCell.occupiedBlack)) {
              moves.push(cell);
            }
          }
        })
      }
    }

    

    return moves;
  }

  private castle(pos: Cell): History {
    const history: History = {
      who: this,
      whereTo: pos,
      whereFrom: this.cell,
      eatEnemy: false,
      specialMove: SpecialMoves.KingSideCastling,
    }

    const delta = this.cell.x - pos.x;
    const coef = delta < 0 ? -1 : 1;
    const rook = pos.piece!;
    const rookCell = this.cell.board.getCell(pos.x+2*coef, pos.y);
    const kingCell = this.cell.board.getCell(pos.x+1*coef, pos.y);
    rook.setPos(rookCell);
    super.setPos(kingCell);

    history.specialMove = coef === 1 ? SpecialMoves.KingSideCastling : SpecialMoves.QueenSideCastling;

    return history;
  }

  public setPos(pos: Cell): History {
    this.hasMoved = true;
    if (pos.piece?.color === this.color) {
      return this.castle(pos);
    } else {
      return super.setPos(pos);
    }
  }

}