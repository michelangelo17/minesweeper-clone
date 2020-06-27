import { cell, cellValue, face, cellState } from '../types'
import { generateCells } from './cellFunctions'
import { TOTAL_BOMBS } from './cellFunctions'

export const firstClick = (
  rowParam: number,
  colParam: number,
  newCells: cell[][],
  currentCell: cell,
  running: boolean,
  setRunning: React.Dispatch<React.SetStateAction<boolean>>
): { newCells: cell[][]; currentCell: cell } => {
  if (!running) {
    while (currentCell.value === cellValue.bomb) {
      newCells = generateCells()
      currentCell = newCells[rowParam][colParam]
    }
    setRunning(true)
  }

  return {
    newCells,
    currentCell,
  }
}

export const losingClick = (
  currentCell: cell,
  newCells: cell[][],
  setCurFace: React.Dispatch<React.SetStateAction<face>>,
  lost: face,
  setRunning: React.Dispatch<React.SetStateAction<boolean>>
) => {
  currentCell.red = true
  newCells.forEach((row) =>
    row.forEach(
      (cellObj) =>
        cellObj.value === cellValue.bomb && (cellObj.state = cellState.visible)
    )
  )
  setCurFace(lost)
  setRunning(false)
}

export const addFlags = (
  flags: number,
  curCell: cell,
  setFlags: React.Dispatch<React.SetStateAction<number>>
) => {
  if (flags < TOTAL_BOMBS && curCell.state === cellState.flagged) {
    curCell.state = cellState.hidden
    setFlags(flags + 1)
  } else if (flags === 0) {
    return
  } else if (curCell.state === cellState.hidden) {
    curCell.state = cellState.flagged
    setFlags(flags - 1)
  }
}
