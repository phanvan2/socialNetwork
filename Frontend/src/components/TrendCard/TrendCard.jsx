import React from 'react'
import './TrendCard.css'

import {TrendData} from '../../data/TrendData' ;
import SearchPost from '../LogoSearch/SearchPost';

export const TrendCard = () => {
  return (
    <div className="TrendCard">
      <SearchPost></SearchPost>

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
