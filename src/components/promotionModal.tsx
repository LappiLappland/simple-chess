import Board from "../classes/board";
import Cell from "../classes/cell";
import { CELL_COLORS } from "../classes/colors";
import GameSounds from "../classes/gameSounds";
import { PromotionHistory } from "../classes/history";
import Bishop from "../classes/pieces/bishop";
import Knight from "../classes/pieces/knight";
import Queen from "../classes/pieces/queen";
import Rook from "../classes/pieces/rook";

interface PromotionModalProps {
  cell: Cell,
  setBoard: (board: Board) => void,
}

export default function PromotionModal({cell, setBoard}: PromotionModalProps) {

  const piece = cell.piece!;
  const color = piece.color === CELL_COLORS.COLOR_BLACK ? 'b' : 'w';

  const pieces: ['queen', 'knight', 'rook', 'bishop'] = ['queen', 'knight', 'rook', 'bishop'];
  const itemsEl = pieces.map(e => {


    return (
      <PieceButton
        color={color}
        piece={e}
        promoteCallback={() => {
          GameSounds.playEvolve();
          const history = cell.board.movesHistory;
          const promotionHistory = history[history.length - 1] as PromotionHistory;
          let newPiece;
          switch (e) {
            case 'bishop':
              newPiece = new Bishop(cell, cell.piece!.color);
              promotionHistory.promotedTo = 'B';
              break;
            case 'knight':
              newPiece = new Knight(cell, cell.piece!.color);
              promotionHistory.promotedTo = 'K';
              break;
            case 'queen':
              newPiece = new Queen(cell, cell.piece!.color);
              promotionHistory.promotedTo = 'Q';
              break;
            case 'rook':
              newPiece = new Rook(cell, cell.piece!.color);
              promotionHistory.promotedTo = 'R';
              break;
          }
          newPiece.teleportPos(cell);
          cell.board.promotePiece = null;
          setBoard(cell.board.copyBoard());
        }}
      ></PieceButton>
    )

  })

  return (
    <div className="promotion-window">
      <span>Promote pawn:</span>
      <ul>
        {itemsEl}
      </ul>
    </div>
  )
}

interface PieceButtonProps {
  color: 'b' | 'w',
  piece: 'queen' | 'knight' | 'rook' | 'bishop',
  promoteCallback: () => void;
}

function PieceButton({color, piece, promoteCallback}: PieceButtonProps) {
  return (
    <li
      onClick={() => {promoteCallback()}}
    >
      <img src={`/simple-chess/pieces/${color}_${piece}.svg`} alt={piece}/>
    </li>
  )
}