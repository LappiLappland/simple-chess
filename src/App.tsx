import { useCallback, useEffect, useState } from 'react';
import './styles/reset.css';
import './styles/index.css';
import './styles/board.css';
import Board from './classes/board';
import BoardComponent from './components/board';
import { CELL_COLORS } from './classes/colors';
import { Player } from './classes/player';
import PiecesHistory from './components/piecesHistory';
import MovesHistory from './components/movesHistory';
import GameTimer from './components/gameTimer';
import GameOverScreen from './components/gameOverModal';
import GameSounds from './classes/gameSounds';
import PromotionModal from './components/promotionModal';

function App() {

  const [board, setBoard] = useState(new Board());
  const [gamesCounter, setGamesCounter] = useState(0);
  const [gamePaused, setGamePaused] = useState(false);
  const [blackPlayer] = useState(new Player(CELL_COLORS.COLOR_BLACK));
  const [whitePlayer] = useState(new Player(CELL_COLORS.COLOR_WHITE));
  const [currentPlayer, setCurrentPlayer] = useState(whitePlayer);
  const [kingIsUnderAttack, setKingIsUnderAttack] = useState<Player | null>(null);

  const restart = useCallback(function restart() {
    const newBoard = new Board();
    newBoard.initializeBoard();
    newBoard.initializePieces();
    setBoard(newBoard);
    setCurrentPlayer(whitePlayer);
    setGamesCounter(prev => prev + 1);
    GameSounds.playRestart();
    setGamePaused(false);
  }, [whitePlayer]);

  useEffect(() => {
    restart();
  }, [restart])

  useEffect(() => {
    if (board.winner) {
      GameSounds.playSong();
      setGamePaused(true);
    }
  }, [board.winner])

  useEffect(() => {
    if (board.promotePiece) setGamePaused(true)
    else setGamePaused(false);
  }, [board.promotePiece])



  function swapPlayer() {
    board.updateOccupation();

    if (board.isKingUnderAttack(CELL_COLORS.COLOR_BLACK)) {
      setKingIsUnderAttack(blackPlayer);
      if (board.kingBlack?.getAvailableMoves().length === 0) {
        board.winner = whitePlayer
      } else {
        setCurrentPlayer(currentPlayer === blackPlayer ? whitePlayer : blackPlayer);
      }
    }
    else if (board.isKingUnderAttack(CELL_COLORS.COLOR_WHITE)) {
      setKingIsUnderAttack(whitePlayer);
      if (board.kingWhite?.getAvailableMoves().length === 0) {
        board.winner = whitePlayer
      } else {
        setCurrentPlayer(currentPlayer === blackPlayer ? whitePlayer : blackPlayer);
      }
    }
    else {
      setKingIsUnderAttack(null);
      setCurrentPlayer(currentPlayer === blackPlayer ? whitePlayer : blackPlayer);
    }
  }

  function revertHistory(times: number) {
    for (let i = 0; i < times; i++) {
      board.revertHistoryOnce();
    }
    const newBoard = board.copyBoard();
    setBoard(newBoard);
    const recentMove = newBoard.movesHistory[newBoard.movesHistory.length - 1];
    if (recentMove && recentMove.who.color === CELL_COLORS.COLOR_WHITE) {
      setCurrentPlayer(blackPlayer);
    } else {
      setCurrentPlayer(whitePlayer)
    }
  }

  return (
    <div className="App">
      <div className="interface"
      >
        <div className="main-board"
        >
          {board.winner ? (
            <GameOverScreen 
            winner={board.winner}
            restart={restart} />
          ) : <></>}
          {board.promotePiece ? (
          <PromotionModal 
            cell={board.promotePiece}
            setBoard={setBoard}
          />
          ) : <></>}
          <h1 className="turn-text"
          >{currentPlayer.color} turn</h1>
          <h2 className="check-text"
          >{kingIsUnderAttack ? `${kingIsUnderAttack.color} is in check!` : ''}</h2>
          <BoardComponent
          board={board}
          setBoard={setBoard}
          currentPlayer={currentPlayer}
          swapPlayer={swapPlayer}
          ></BoardComponent>
        </div>
        <div className="info-tab">
          <h2>Information Tab</h2>
          <GameTimer
          key={gamesCounter}
          board={board}
          setBoard={setBoard}
          currentPlayer={currentPlayer}
          secondPlayer={currentPlayer === blackPlayer ? whitePlayer : blackPlayer}
          gamePaused={gamePaused}
          ></GameTimer>
          <PiecesHistory
          piecesHistory={board.piecesHistory}
          ></PiecesHistory>
          <MovesHistory
          movesHistory={board.movesHistory}
          revertHistory={revertHistory}
          ></MovesHistory>
        </div>
      </div>
      
    </div>
  );
}

export default App;
