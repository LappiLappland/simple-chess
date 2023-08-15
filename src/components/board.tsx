import { Fragment, useEffect, useState } from 'react';
import Board from '../classes/board';
import Cell from '../classes/cell';
import { Player } from '../classes/player';
import '../styles/board.css';
import CellComponent from './cell';

interface BoardProps {
  board: Board,
  setBoard: (board: Board) => void,
  currentPlayer: Player,
  swapPlayer: () => void,
}

export default function BoardComponent({board, currentPlayer, setBoard, swapPlayer}: BoardProps) {
  
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  useEffect(() => {
    highlightBoard();
  }, [selectedCell])


  function selectCell(cell: Cell) {
    if (selectedCell && selectedCell !== cell &&
       selectedCell.piece && cell.available) {
      if (cell.piece) {
        board.piecesHistory.push(cell.piece);
      }
      selectedCell.movePieceTo(cell);
      setSelectedCell(null);
      swapPlayer();
    }
    else if (cell && cell.piece &&
      cell.piece.color === currentPlayer.color) {
      setSelectedCell(cell);
    }
    else {
      setSelectedCell(null);
    }
  }

  function highlightBoard() {
    board.highlightBoard(selectedCell);
    updateBoard();
  }

  function updateBoard() {
    const newBoard = board.copyBoard();
    setBoard(newBoard);
  }

  return (
    <div className="board"
    >
      {board.cells.map((line, i) => {
        return (
          <Fragment key={i}>
            {line.map(cell => {
              return (
                <CellComponent
                cell={cell}
                selected={selectedCell === cell}
                selectCell={selectCell}
                key={cell.x*10 + cell.y}
                ></CellComponent>
              )
            })}
          </Fragment>
        )
      })}
    </div>
  )
}

