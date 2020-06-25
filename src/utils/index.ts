import { cellValue, cellState, cell, neighborInfo } from '../types'

// variables
const MAX_ROWS = 9
const MAX_COLS = 9
export const TOTAL_BOMBS = 10

//functions

const getNeighborInfo = (
  c: cell,
  rowIndex: number,
  colIndex: number,
  cells: cell[][]
): neighborInfo => {
  const returnObj: neighborInfo = {
    neighbors: [],
    bombCount: 0,
  }
  if (c.value !== cellValue.bomb) {
    for (let checkRow = rowIndex - 1; checkRow <= rowIndex + 1; checkRow++) {
      if (checkRow >= 0 && checkRow <= MAX_ROWS - 1) {
        for (
          let checkCol = colIndex - 1;
          checkCol <= colIndex + 1;
          checkCol++
        ) {
          if (checkCol >= 0 && checkCol <= MAX_COLS - 1) {
            returnObj.neighbors.push({
              cell: cells[checkRow][checkCol],
              rowParam: checkRow,
              colParam: checkCol,
            })
            if (cells[checkRow][checkCol].value === cellValue.bomb) {
              returnObj.bombCount++
            }
          }
        }
      }
    }
  }

  return returnObj
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
      const numberOfBombs = getNeighborInfo(cell, rowIndex, colIndex, cells)
        .bombCount

      if (numberOfBombs > 0) cells[rowIndex][colIndex].value = numberOfBombs
    })
  )

  return cells
}

export const makeCellBlockVisible = (
  cells: cell[][],
  rowParam: number,
  colParam: number
): cell[][] => {
  const newCells = cells.slice()
  const currentCell = newCells[rowParam][colParam]

  currentCell.state = cellState.visible

  const neighbors = getNeighborInfo(currentCell, rowParam, colParam, cells)
    .neighbors

  neighbors.forEach((cellDetail) => {
    if (
      cellDetail.cell.state !== cellState.flagged &&
      cellDetail.cell.state !== cellState.visible
    ) {
      if (cellDetail.cell.value === cellValue.none)
        makeCellBlockVisible(newCells, cellDetail.rowParam, cellDetail.colParam)
      else
        newCells[cellDetail.rowParam][cellDetail.colParam].state =
          cellState.visible
    }
  })

  return newCells
}

export const checkGameWon = (gameCells: cell[][]): boolean => {
  let coveredBombs = 0
  let notVisible = 0
  gameCells.forEach((row) =>
    row.forEach((cellObj) => {
      if (
        cellObj.state === cellState.flagged &&
        cellObj.value === cellValue.bomb
      )
        coveredBombs++
      if (
        cellObj.state === cellState.open ||
        cellObj.state === cellState.flagged
      ) {
        notVisible++
      }
    })
  )
  if (coveredBombs === TOTAL_BOMBS && notVisible === coveredBombs) return true
  else return false
}
