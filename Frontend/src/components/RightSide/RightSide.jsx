import React, { useState } from 'react'
import './RightSide.css'

import Home from '../../img/home.png'
import { UilMessage } from '@iconscout/react-unicons'
import { UilSetting } from '@iconscout/react-unicons'
import { UilSignout } from '@iconscout/react-unicons'
import { TrendCard } from '../TrendCard/TrendCard'
import ShareModal from '../ShareModal/ShareModal'
import { useDispatch } from 'react-redux'
import { logOut } from '../../actions/AuthAction'
import { Link } from 'react-router-dom'
import swal from 'sweetalert'; 

export const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const dispatch = useDispatch();
  const handleLogOut = () => {

    swal("Are you sure you want to sign out of your account?",  {
      buttons: true,
      icon: "warning",

    })
    .then((value) => {
      if(value)
        dispatch(logOut())

    });
  }
  return (
    <div className="RightSide">
      <div className="navIcons">
        <Link style={{ width: "1.5rem", height: "1.5rem" }} to="/home">
          <img style={{ width: "100%", height: "100%" }} src={Home} alt="" />
        </Link>
        <UilSetting style={{ cursor: "pointer" }} />
        <Link to="/chat">
          <UilMessage style={{ cursor: "pointer" }} />
        </Link>
        <UilSignout style={{ cursor: "pointer" }} onClick={handleLogOut} />
      </div>

      <TrendCard />

      <button className='button r-button' onClick={() => setModalOpened(true)}>
        Share
      </button>
      <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} />
    </div>
  )
}
