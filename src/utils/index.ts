import { cellValue, cellState, cell } from '../types'

// variables
const MAX_ROWS = 9
const MAX_COLS = 9

//functions

export const generateCells = (): cell[][] => {
  const cells: cell[][] = []
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([])
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: cellValue.none,
        state: cellState.open,
      })
    }
  }
  return cells
}
