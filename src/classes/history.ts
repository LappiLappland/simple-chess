import Cell from "./cell";
import Piece from "./pieces/piece";

export interface History {
  who: Piece,
  whereTo: Cell,
  whereFrom: Cell,
  eatEnemy: boolean,
  specialMove: number,
}

export enum SpecialMoves {
  None = 0,
  KingSideCastling = 1,
  QueenSideCastling = 2,
}