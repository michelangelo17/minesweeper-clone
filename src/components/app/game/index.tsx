import React, { useState, useEffect } from 'react'
import './game.scss'
import NumberDisplay from './numberDisplay/index'
import Button from './button/index'
import {
  generateCells,
  TOTAL_BOMBS,
  makeCellBlockVisible,
  checkGameWon,
} from '../../../utils/cellFunctions'
import { face, cell, cellState, cellValue } from '../../../types'
import {
  firstClick,
  losingClick,
  addFlags,
} from '../../../utils/clickFunctions'

const Game: React.FC = () => {
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

  useEffect(() => {
    if (checkGameWon(cells)) {
      setCurFace(face.won)
      setRunning(false)
    }
  }, [cells, flags])

  const handleCellClick = (rowParam: number, colParam: number): void => {
    if (curFace === face.lost || curFace === face.won) return
    let { newCells, currentCell } = firstClick(
      rowParam,
      colParam,
      cells.slice(),
      cells[rowParam][colParam],
      running,
      setRunning
    )

    if (currentCell.state === cellState.flagged) return
    if (currentCell.state === cellState.visible) return

    if (currentCell.value === cellValue.bomb)
      losingClick(currentCell, newCells, setCurFace, face.lost, setRunning)
    else if (currentCell.value === cellValue.none)
      newCells = makeCellBlockVisible(newCells, rowParam, colParam)
    else currentCell.state = cellState.visible

    setCells(newCells)
  }

  const restartGame = () => {
    setRunning(false)
    setCurFace(face.smile)
    setTime(0)
    setFlags(TOTAL_BOMBS)
    setCells(generateCells())
  }

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    rowParam: number,
    colParam: number
  ) => {
    e.preventDefault()
    if (curFace === face.lost || curFace === face.won) return

    addFlags(flags, cells[rowParam][colParam], setFlags)
  }

  return (
    <div className='game'>
      <div className='header'>
        <NumberDisplay value={flags} />
        <div className='face' onClick={restartGame}>
          <span role='img' aria-label='smiley face'>
            {curFace}
          </span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className='body'>
        {cells.map((row, rowIndex) =>
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
              handleRightClick={handleRightClick}
              red={cell.red}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Game
