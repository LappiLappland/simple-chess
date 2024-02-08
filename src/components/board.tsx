import { Fragment, useCallback, useEffect, useState } from 'react';
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

  const updateBoard = useCallback(function updateBoard() {
    const newBoard = board.copyBoard();
    setBoard(newBoard);
  }, [board, setBoard]);

  const highlightBoard = useCallback(function highlightBoard() {
    board.highlightBoard(selectedCell);
    updateBoard();
  }, [board, selectedCell, updateBoard]);

  useEffect(() => {
    highlightBoard();
  }, [highlightBoard, selectedCell])


  function selectCell(cell: Cell) {
    if (selectedCell && selectedCell !== cell &&
       selectedCell.piece && cell.available) {
      selectedCell.movePieceTo(cell, board);
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

