import React, { useState, useEffect } from 'react'
import './app.scss'
import NumberDisplay from '../numberDisplay'
import {
  generateCells,
  TOTAL_BOMBS,
  makeCellBlockVisible,
  checkGameWon,
} from '../../utils/index'
import Button from '../button'
import { face, cell, cellState, cellValue } from '../../types'

const App: React.FC = () => {
  const [cells, setCells] = useState<cell[][]>(generateCells())
  const [curFace, setCurFace] = useState<face>(face.smile)
  const [time, setTime] = useState<number>(0)
  const [running, setRunning] = useState<boolean>(false)
  const [flags, setFlags] = useState<number>(TOTAL_BOMBS)

  useEffect(() => {
    if (running && time < 999) {
      const timer = setInterval(() => setTime(time + 1), 1000)
      return () => clearInterval(timer)
    }
  }, [running, time])

  const handleCellClick = (rowParam: number, colParam: number) => {
    if (curFace === face.lost || curFace === face.won) return
    let newCells = cells.slice()
    let currentCell = newCells[rowParam][colParam]

    if (!running) {
      while (currentCell.value === cellValue.bomb) {
        newCells = generateCells()
        currentCell = newCells[rowParam][colParam]
      }
      setRunning(true)
    }

    if (currentCell.state === cellState.flagged) return
    if (currentCell.state === cellState.visible) return

    if (currentCell.value === cellValue.bomb) {
      currentCell.red = true
      newCells.forEach((row) =>
        row.forEach(
          (cellObj) =>
            cellObj.value === cellValue.bomb &&
            (cellObj.state = cellState.visible)
        )
      )
      setCurFace(face.lost)
      setRunning(false)
    } else if (currentCell.value === cellValue.none) {
      newCells = makeCellBlockVisible(newCells, rowParam, colParam)
    } else currentCell.state = cellState.visible
    setCells(newCells)
    if (checkGameWon(cells)) {
      setCurFace(face.won)
      setRunning(false)
    }
  }

  const restartGame = () => {
    setRunning(false)
    setCurFace(face.smile)
    setTime(0)
    setFlags(TOTAL_BOMBS)
    setCells(generateCells())
  }

  const addFlag = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    rowParam: number,
    colParam: number
  ) => {
    e.preventDefault()
    if (curFace === face.lost || (curFace === face.won && running)) return
    const curCell = cells[rowParam][colParam]
    if (flags < TOTAL_BOMBS && curCell.state === cellState.flagged) {
      curCell.state = cellState.open
      setFlags(flags + 1)
    } else if (flags === 0) {
      return
    } else if (curCell.state === cellState.open) {
      curCell.state = cellState.flagged
      setFlags(flags - 1)
    }
    if (checkGameWon(cells)) {
      setCurFace(face.won)
      setRunning(false)
    }
  }

  const renderCells = (): React.ReactNode =>
    cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}x${colIndex}`}
          row={rowIndex}
          col={colIndex}
          state={cell.state}
          value={cell.value}
          setCurFace={setCurFace}
          curFace={curFace}
          handleCellClick={handleCellClick}
          addFlag={addFlag}
          red={cell.red}
        />
      ))
    )

  return (
    <div className='app'>
      <div className='header'>
        <NumberDisplay value={flags} />
        <div className='face' onClick={restartGame}>
          <span role='img' aria-label='smiley face'>
            {curFace}
          </span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className='body'>{renderCells()}</div>
    </div>
  )
}

export default App
