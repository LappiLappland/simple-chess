import { History, SpecialMoves } from "../classes/history";
import lettersMap from "../classes/lettersMap";

interface MovesHistoryProps {
  movesHistory: History[],
  revertHistory: (times: number) => void,
}

export default function MovesHistory({movesHistory, revertHistory}: MovesHistoryProps) {

  function createMoveSpan(move: History) {
    switch (move.specialMove) {
      case SpecialMoves.None:
        return (
          <>
            <span>{lettersMap[(move.whereTo.x) as 0|1|2|3|4|5|6|7]}</span>
            {move.eatEnemy ? <span>x</span> : <></>}
            <span>{8 - move.whereTo.y}</span>
          </>
        )
      case SpecialMoves.KingSideCastling:
        return <span>0-0</span>
      case SpecialMoves.QueenSideCastling:
        return <span>0-0-0</span>
      case SpecialMoves.Passant:
        return (
          <>
            <span>{lettersMap[(move.whereTo.x) as 0|1|2|3|4|5|6|7]}</span>
            {move.eatEnemy ? <span>x</span> : <></>}
            <span>{8 - move.whereTo.y}</span>
            <span> e.p.</span>
          </>
        )
      case SpecialMoves.Promotion:
        return (
          <>
            <span>{lettersMap[(move.whereTo.x) as 0|1|2|3|4|5|6|7]}</span>
            {move.eatEnemy ? <span>x</span> : <></>}
            <span>{8 - move.whereTo.y}</span>
            {!move.promotedTo ? <span>=?</span> : <span>={move.promotedTo}</span>}
          </>
        )
      default:
        return <></>
    }
  }

  const movesComponents = movesHistory.map((move, i) => {

    let moveSpan =createMoveSpan(move);

    return (
      <li
      key={i}
      >
      <img
      alt={move.who.name}
      src={move.who.img}
      ></img>
      {moveSpan}
      <button
      onClick={() => {
        revertHistory(movesHistory.length - i)
      }}
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