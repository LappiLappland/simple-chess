import Cell from "./cell";
import Piece from "./pieces/piece";

export interface SimpleHistory {
  who: Piece,
  whereTo: Cell,
  whereFrom: Cell,
  eatEnemy: Piece | null,
  extraEvent?: () => void,
}

export interface BasicHistory extends SimpleHistory {
  specialMove: Exclude<SpecialMoves, SpecialMoves.Promotion>,
}

export interface PromotionHistory extends SimpleHistory {
  specialMove: SpecialMoves.Promotion,
  promotedTo: 'Q' | 'K' | 'R' | 'B',
}

export type History = BasicHistory | PromotionHistory;

export enum SpecialMoves {
  None = 0,
  KingSideCastling = 1,
  QueenSideCastling = 2,
  Passant = 3,
  Promotion = 4,
}