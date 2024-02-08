import { create2DArray } from "../helpers/arrays";
import Cell from "./cell";
import { CELL_COLORS } from "./colors";
import Bishop from "./pieces/bishop";
import King from "./pieces/king";
import Knight from "./pieces/knight";
import Pawn from "./pieces/pawn";
import Piece from "./pieces/piece";
import Queen from "./pieces/queen";
import Rook from "./pieces/rook";
import { History, SpecialMoves } from "./history";
import { Player } from "./player";
import GameSounds from "./gameSounds";

export default class Board {
  cells: Cell[][] = [];
  piecesHistory: Piece[] = [];
  movesHistory: History[] = [];
  kingBlack: King | null = null;
  kingWhite: King | null = null;
  winner: Player | null = null;
  promotePiece: Cell | null = null;

  public initializeBoard() {
    const array = create2DArray(8);
    this.cells = array.map((y: null[], i: number) => {
      return y.map((x: null, j: number) => {
        let color = CELL_COLORS.COLOR_BLACK;
        if ((i+j) % 2 === 0) color = CELL_COLORS.COLOR_WHITE;
        return (
          new Cell(this, j, i, color, null)
        )
      })
    })
  }

  private fillPiecesLine(line: Cell[], color: CELL_COLORS) {
    line[0].piece = new Rook(line[0], color);
    line[1].piece = new Knight(line[1], color);
    line[2].piece = new Bishop(line[2], color);
    line[3].piece = new Queen(line[3], color);
    line[4].piece = new King(line[4], color);
    line[5].piece = new Bishop(line[5], color);
    line[6].piece = new Knight(line[6], color);
    line[7].piece = new Rook(line[7], color);
  }

  private fillPawnsLine(line: Cell[], color: CELL_COLORS) {
    line.forEach(cell => cell.piece = new Pawn(cell, color));
  }

  public initializePieces() {
    this.fillPiecesLine(this.cells[0], CELL_COLORS.COLOR_BLACK);
    this.fillPawnsLine(this.cells[1], CELL_COLORS.COLOR_BLACK);

    this.fillPawnsLine(this.cells[6], CELL_COLORS.COLOR_WHITE);
    this.fillPiecesLine(this.cells[7], CELL_COLORS.COLOR_WHITE);

    this.kingBlack = this.cells[0][4].piece as King;
    this.kingWhite = this.cells[7][4].piece as King;

    this.updateOccupation();
  }

/*   public debugBoardCastle() {
    this.cells[7][1].piece = null;
    this.cells[7][2].piece = null;
    this.cells[7][3].piece = null;
    this.cells[7][5].piece = null;
    this.cells[7][6].piece = null;
  }
  public debugBoardPromotion() {
    this.cells[6][0].piece!.teleportPos(this.cells[1][0]);
  } */

  public getCell(x: number, y: number) {
    if (x > 7 || x < 0 || y > 7 || y < 0) {
      return null;
    }
    return this.cells[y][x];
  }

  public cellExists(x: number, y: number) {
    return (x >= 0 && x < this.getRowLength()
    &&  y >= 0 && y < this.getColumnLength())
  }

  public getRowLength() {
    return this.cells[0].length;
  }

  public getColumnLength() {
    return this.cells.length;
  }

  public updateOccupation() {
    this.cells.forEach(row => {
      row.forEach(cell => {
        cell.occupiedBlack = false;
        cell.occupiedWhite = false;
      })
    })
    this.cells.forEach(row => {
      row.forEach(cell => {
        if (cell.piece) {
          cell.piece.setAvailableMoves();
        }
      })
    })
  }

  public isKingUnderAttack(color: CELL_COLORS) {
    if (color === CELL_COLORS.COLOR_BLACK) {
      return !!this.kingBlack?.cell.occupiedWhite;
    } else {
      return !!this.kingWhite?.cell.occupiedBlack;
    }
  }

  public copyBoard() {
    const newBoard = new Board();
    newBoard.cells = this.cells;
    newBoard.piecesHistory = this.piecesHistory;
    newBoard.movesHistory = this.movesHistory;
    newBoard.kingBlack = this.kingBlack;
    newBoard.kingWhite = this.kingWhite;
    newBoard.winner = this.winner;
    newBoard.promotePiece = this.promotePiece;
    return newBoard;
  }

  public revertHistoryOnce() {
    const move = this.movesHistory.pop();
    if (move) {
      switch (move.specialMove) {
        case SpecialMoves.None:
          if (move.eatEnemy) {
            const zombie = this.piecesHistory.pop();
            if (zombie) zombie.teleportPos(move.whereTo);
          }
          break;
        case SpecialMoves.QueenSideCastling:
          const rook = this.getCell(2, move.whereTo.y)!.piece as Rook;
          if (rook) {
            rook.teleportPos(this.getCell(0, 7)!);
            rook.hasMoved = false;
          }
          const king = move.who as King;
          king.hasMoved = false;
          break;
        case SpecialMoves.KingSideCastling:
          const rook2 = this.getCell(5, move.whereTo.y)!.piece as Rook;
          if (rook2) {
            rook2.teleportPos(this.getCell(7, 7)!);
            rook2.hasMoved = false;
          }
          const king2 = move.who as King;
          king2.hasMoved = false;
          break;
        case SpecialMoves.Passant:
          const zombie = this.piecesHistory.pop();
          if (zombie) {
            const cellFront = this.getCell(move.whereTo.x, move.whereFrom.y)!;
            zombie.teleportPos(cellFront);
          }
          break;
        case SpecialMoves.Promotion:
          if (this.promotePiece) {
            this.promotePiece = null;
          }
          if (move.eatEnemy) {
            const zombie = this.piecesHistory.pop();
            if (zombie) zombie.teleportPos(move.whereTo);
          }
          break;
        default:
          break;
      }
      move.who.teleportPos(move.whereFrom);
      if (move.extraEvent) move.extraEvent();
      if (this.winner) this.winner = null;
    }
    this.updateOccupation();
    GameSounds.playSpecial();
  }

  public highlightBoard(selected: Cell | null) {
    this.cells.forEach(y => {
      y.forEach(x => {
        x.available = false;
      })
    });
    if (selected && selected.piece) {
      selected.piece.getAvailableMoves().forEach(
        cell => cell.available = true 
      );
    }
  }

}