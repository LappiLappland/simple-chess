import { useEffect, useState } from 'react';
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

function App() {

  const [board, setBoard] = useState(new Board());
  const [gamesCounter, setGamesCounter] = useState(0);
  const [blackPlayer, setBlackPlayer] = useState(new Player(CELL_COLORS.COLOR_BLACK));
  const [whitePlayer, setWhitePlayer] = useState(new Player(CELL_COLORS.COLOR_WHITE));
  const [currentPlayer, setCurrentPlayer] = useState(whitePlayer);
  const [kingIsUnderAttack, setKingIsUnderAttack] = useState<Player | null>(null);

  useEffect(() => {
    restart();
  }, [])

  function restart() {
    const newBoard = new Board();
    newBoard.initializeBoard();
    newBoard.initializePieces();
    setBoard(newBoard);
    setCurrentPlayer(whitePlayer);
    setGamesCounter(prev => prev + 1);
  }

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
          {board.winner ? <GameOverScreen winner={board.winner} restart={restart}></GameOverScreen> : <></>}
          <h1 className="turn-text"
          >{currentPlayer.color} turn</h1>
          <h2>{kingIsUnderAttack ? `${kingIsUnderAttack.color} is in check!` : ''}</h2>
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
