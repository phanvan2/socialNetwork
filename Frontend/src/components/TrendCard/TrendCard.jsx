import React from 'react'
import './TrendCard.css'

import {TrendData} from '../../data/TrendData'

export const TrendCard = () => {
  return (
    <div className="TrendCard">
      <h3>Trends for you</h3>
      {TrendData.map((trend) =>{
        return (
          <div className='trend'>
            <span>#{trend.name}</span>
            <span>{trend.shares}</span>
          </div>
        )
      })}
    </div>
  )
}
