import React from 'react'
import './button.scss'
import { cellState, cellValue } from '../../types'

interface ButtonProps {
  row: number
  col: number
  state: cellState
  value: cellValue
}

const Button: React.FC<ButtonProps> = ({ row, col, state, value }) => {
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
  return (
    <div
      className={`button ${
        state === cellState.visible && 'visible'
      } value-${value}`}
    >
      {renderContent()}
    </div>
  )
}

export default Button
