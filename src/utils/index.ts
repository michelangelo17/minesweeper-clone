import { cellValue, cellState, cell } from '../types'

// variables
const MAX_ROWS = 9
const MAX_COLS = 9
const TOTAL_BOMBS = 10

//functions

const countBombs = (
  c: cell,
  rowIndex: number,
  colIndex: number,
  cells: cell[][]
): number => {
  let numberOfBombs = 0
  if (c.value !== cellValue.bomb) {
    for (let checkRow = rowIndex - 1; checkRow <= rowIndex + 1; checkRow++) {
      if (checkRow >= 0 && checkRow <= MAX_ROWS - 1) {
        for (
          let checkCol = colIndex - 1;
          checkCol <= colIndex + 1;
          checkCol++
        ) {
          if (checkCol >= 0 && checkCol <= MAX_COLS - 1) {
            if (cells[checkRow][checkCol].value === cellValue.bomb) {
              numberOfBombs++
            }
          }
        }
      }
    }
  }
  return numberOfBombs
}

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

  let bombsPlaced = 0

  while (bombsPlaced < TOTAL_BOMBS) {
    const row = Math.floor(Math.random() * MAX_ROWS)
    const col = Math.floor(Math.random() * MAX_COLS)

    const currentCell = cells[row][col]
    if (currentCell.value !== cellValue.bomb) {
      currentCell.value = cellValue.bomb
      bombsPlaced++
    }
  }

  cells.forEach((row, rowIndex) =>
    row.forEach((cell, colIndex) => {
      const numberOfBombs = countBombs(cell, rowIndex, colIndex, cells)
      if (numberOfBombs > 0) cells[rowIndex][colIndex].value = numberOfBombs
    })
  )

  return cells
}
