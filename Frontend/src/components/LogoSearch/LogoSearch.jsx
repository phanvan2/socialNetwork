import React from 'react'
import Logo from '../../img/logo.png';
import {UilSearch} from '@iconscout/react-unicons';
import './LogoSearch.css'

const LogoSearch = () => {
  return (
    <div className='LogoSearch'>
      {/* <img width={50} height={50} src={Logo} alt='' /> */}
      <div className='search'>
        <input type="text" placeholder='#Explore' />
        <div className='s-icon'>
          <UilSearch />
        </div>
      </div>
    </div>
  )
}

export default LogoSearch
