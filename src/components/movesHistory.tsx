import { History } from "../classes/history";
import lettersMap from "../classes/lettersMap";

interface MovesHistoryProps {
  movesHistory: History[],
  revertHistory: (times: number) => void,
}

export default function MovesHistory({movesHistory, revertHistory}: MovesHistoryProps) {

  const movesComponents = movesHistory.map((move, i) => {
    return (
      <li
      key={i}
      >
      <img
      alt={move.who.name}
      src={move.who.img}
      ></img>
      <span>{lettersMap[(move.whereTo.x) as 0|1|2|3|4|5|6|7]}</span>
      {move.eatEnemy ? <span>x</span> : <></>}
      <span>{8 - move.whereTo.y}</span>
      <button
      onClick={() => {revertHistory(movesHistory.length - i)}}
      >Go here</button>
      </li>
    )
  })
  
  return (
    <div className="moves-history"
    >
      <div>
        <h2>Moves history:</h2>
        <ul className="moves-history-line"
        >
          {movesComponents}
        </ul>
      </div>
    </div>
  )
}