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
import { History } from "./history";
import { Player } from "./player";

export default class Board {
  cells: Cell[][] = [];
  piecesHistory: Piece[] = [];
  movesHistory: History[] = [];
  kingBlack: King | null = null;
  kingWhite: King | null = null;
  winner: Player | null = null;
  
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

  public getCell(x: number, y: number) {
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
    console.log(this.cells);
    return newBoard;
  }

  public revertHistoryOnce() {
    const move = this.movesHistory.pop();
    if (move) {
      move.who.setPos(move.whereFrom);
      if (move.eatEnemy) {
        const zombie = this.piecesHistory.pop();
        zombie!.cell = move.whereTo;
      }
    }
    this.updateOccupation();
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