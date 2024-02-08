import { useCallback, useEffect, useRef, useState } from "react";
import Board from "../classes/board";
import { CELL_COLORS } from "../classes/colors";
import { Player } from "../classes/player";

interface GameTimerProps {
  currentPlayer: Player,
  secondPlayer: Player,
  board: Board,
  setBoard: (board: Board) => void,
  gamePaused: boolean,
}

export default function GameTimer({currentPlayer, secondPlayer, board, setBoard, gamePaused}: GameTimerProps) {

  const [timeBlack, setTimeBlack] = useState(300);
  const [timeWhite, setTimeWhite] = useState(300);

  const timer = useRef<any>(null);
  
  const startTimer = useCallback(function startTimer() {
    if (timer.current) {
      clearInterval(timer.current);
    }

    const callback = currentPlayer.color === CELL_COLORS.COLOR_BLACK ?
                    () => {setTimeBlack(prev => prev - 1)} :
                    () => {setTimeWhite(prev => prev - 1)} ;

    timer.current = setInterval(callback, 1000)
  }, [currentPlayer.color]);

  useEffect(() => {
    startTimer();
  }, [currentPlayer, startTimer])

  useEffect(() => {
    if (gamePaused) stopTimer()
    else startTimer();
  }, [gamePaused, startTimer])

  useEffect(() => {
    if ((currentPlayer.color === CELL_COLORS.COLOR_BLACK && timeBlack <= 0)
      ||(currentPlayer.color === CELL_COLORS.COLOR_WHITE && timeWhite <= 0)) {
      clearInterval(timer.current);
      board.winner = secondPlayer;
      const newBoard = board.copyBoard();
      setBoard(newBoard);
    }
  }, [board, currentPlayer.color, secondPlayer, setBoard, timeBlack, timeWhite])

  function stopTimer() {
    clearInterval(timer.current);
  }

  function formatTime(init: number) {
    const minutes = Math.floor(init / 60);
    const seconds = init - minutes * 60;

    const mS = minutes < 10 ? '0'+minutes : minutes;
    const sS = seconds < 10 ? '0'+seconds : seconds;

    return `${mS}:${sS}`
  }

  return (
    <div className="game-timer"
    >
      <div>
        <h2>White time:</h2>
        <span>{formatTime(timeWhite)}</span>
      </div>
      <div>
        <h2>black time:</h2>
        <span>{formatTime(timeBlack)}</span>
      </div>
    </div>
  )
}