import { CELL_COLORS } from "../classes/colors";
import Piece from "../classes/pieces/piece"

interface PiecesHistoryProps {
  piecesHistory: Piece[],
}

export default function PiecesHistory({piecesHistory}: PiecesHistoryProps) {
  
  const white: Piece[] = [];
  const black: Piece[] = [];

  piecesHistory.forEach(piece => {
    if (piece.color === CELL_COLORS.COLOR_BLACK) {
      black.push(piece);
    } else {
      white.push(piece);
    }
  })
  
  return (
    <div className="pieces-history"
    >
      <div>
        <h2>white pieces:</h2>
        <ul className="pieces-history-line"
        >
          {white.map((piece, i) => (
            <li key={i}><img alt={piece.name} src={piece.img}></img></li>
          ))}
        </ul>
      </div>
      <div>
        <h2>black pieces:</h2>
        <ul className="pieces-history-line"
        >
          {black.map((piece, i)=> (
            <li key={i}><img alt={piece.name} src={piece.img}></img></li>
          ))}
        </ul>
      </div>
    </div>
  )
}