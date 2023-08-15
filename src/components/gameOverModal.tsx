import { Player } from "../classes/player"

interface GameOverScreenProps {
  winner: Player,
  restart: () => void,
}

export default function GameOverScreen({winner, restart}: GameOverScreenProps) {



  return (
    <div className="game-over">
      <h2>Game over!</h2>
      <span>{winner.color} won</span>
      <button
      onClick={() => restart()}
      >Play again</button>
    </div>
  )
}