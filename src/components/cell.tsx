import Cell from '../classes/cell';
import lettersMap from '../classes/lettersMap';
import '../styles/board.css';

interface CellProps {
  cell: Cell,
  selected: boolean,
  selectCell: (cell: Cell) => void,
}

type AvailableClass = '' | 'available-eat' | 'available'; 

export default function CellComponent({cell, selected, selectCell}: CellProps) {
  
  let availableClass: AvailableClass = '';
  if (cell.available && cell.piece) {
    availableClass = 'available-eat';
  }
  else if (cell.available) {
    availableClass = 'available';
  }

  function onClicked(e: React.MouseEvent<HTMLElement>) {
    selectCell(cell);
  }

  return (
    <div className={`cell ${cell.color} ${selected ? 'selected' : ''}`}
    onClick={onClicked}
    >
      {cell.x === 0 ? (<div className='number'
      >{8 - cell.y}</div>) : <></>}
      
      {cell.y === 7 ? (<div className='letter'
      >{lettersMap[(cell.x) as 0|1|2|3|4|5|6|7]}</div>) : <></>}

      <div className={`${availableClass}`}
      ></div>
      {cell.piece ? <img alt={cell.piece.name} src={cell.piece.img}></img> : <></>}
    </div>  
  )
}