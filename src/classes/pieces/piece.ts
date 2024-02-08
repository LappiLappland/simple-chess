import Cell from "../cell";
import { CELL_COLORS } from "../colors";
import GameSounds from "../gameSounds";
import { History, SpecialMoves } from "../history";

export enum PIECES_NAMES {
  KING = 'King',
  QUEEN = 'Queen',
  ROOK = 'Rook',
  BISHOP = 'Bishop',
  KNIGHT = 'Knight',
  PAWN = 'Pawn',
}

export default class Piece {
  color: CELL_COLORS;
  img: string;
  cell: Cell;
  name: PIECES_NAMES;

  constructor(
    cell: Cell,
    color: CELL_COLORS,
  ) {
    this.cell = cell;
    this.color = color;
    this.cell.piece = this;
    this.name = PIECES_NAMES.PAWN;
    this.img = "";
  }

  public setPos(pos: Cell): History {
    const history: History = {
      who: this,
      whereTo: pos,
      whereFrom: this.cell,
      eatEnemy: pos.piece,
      specialMove: SpecialMoves.None,
    }
    this.cell.piece = null;
    this.cell = pos;
    pos.piece = this;

    GameSounds.playMove();

    return history
  }

  public teleportPos(pos: Cell) {
    if (this.cell.piece === this)
      this.cell.piece = null;
    this.cell = pos;
    pos.piece = this;
  }

  protected filterOutOwn(arrays: Cell[][]) {
    const filtered: Cell[] = [];
    arrays.forEach(array => {
      array.forEach(cell => {
        if (!(cell.piece?.color === this.color)) {
          filtered.push(cell);
        }
      })
    })
    return filtered;
  }

  protected setAvailableForArrays(arrays: Cell[][]) {
    const filtered: Cell[] = [];
    arrays.forEach(array => {
      array.forEach(cell => {
        if (this.color === CELL_COLORS.COLOR_BLACK) {
          cell.occupiedBlack = true;
        } else {
          cell.occupiedWhite = true;
        }
      })
    })
    return filtered;
  }

  //TODO: when in check, pieces should be able to move only to cells that protect king
  //? This is kind of hard to do tho, and this is the only thing missing, heh
  public getAvailableMoves(): Cell[] {
    return [];
  }

  public setAvailableMoves() {
    
  }

}
