import React from 'react'
import './button.scss'
import { cellState, cellValue, face } from '../../types'

interface ButtonProps {
  row: number
  col: number
  state: cellState
  value: cellValue
  setCurFace: React.Dispatch<React.SetStateAction<face>>
  handleCellClick: (rowParam: number, colParam: number) => void
  addFlag: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    rowParam: number,
    colParam: number
  ) => void
}

const Button: React.FC<ButtonProps> = ({
  row,
  col,
  state,
  value,
  setCurFace,
  handleCellClick,
  addFlag,
}) => {
  const renderContent = (): React.ReactNode => {
    if (state === cellState.visible) {
      if (value === cellValue.bomb) {
        return (
          <span role='img' aria-label='bomb'>
            💣
          </span>
        )
      }
      return value > 0 && value
    } else if (state === cellState.flagged) {
      return (
        <span role='img' aria-label='flag'>
          🚩
        </span>
      )
    }
  }
  const mouse = (aface: face) => setCurFace(aface)
  return (
    <div
      className={`button ${
        state === cellState.visible && 'visible'
      } value-${value}`}
      onMouseDown={() => mouse(face.nervous)}
      onMouseUp={() => mouse(face.smile)}
      onClick={() => handleCellClick(row, col)}
      onContextMenu={(e) => addFlag(e, row, col)}
    >
      {renderContent()}
    </div>
  )
}

export default Button
