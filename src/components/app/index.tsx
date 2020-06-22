import React, { useState } from 'react'
import './app.scss'
import NumberDisplay from '../numberDisplay'
import { generateCells } from '../../utils/index'
import Button from '../button'

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells())
  const renderCells = (): React.ReactNode =>
    cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => <Button key={`${rowIndex}x${colIndex}`} />)
    )
  return (
    <div className='app'>
      <div className='header'>
        <NumberDisplay value={0} />
        <div className='face'>
          <span role='img' aria-label='smiley face'>
            🙂
          </span>
        </div>
        <NumberDisplay value={23} />
      </div>
      <div className='body'>{renderCells()}</div>
    </div>
  )
}

export default App
