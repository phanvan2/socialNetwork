import React, { useState } from 'react'
import './RightSide.css'

import Home from '../../img/home.png'
import { UilMessage, UilSetting,UilSignout, UilBell  } from '@iconscout/react-unicons'
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom'
import swal from 'sweetalert'; 
import { useDispatch } from 'react-redux';
import { Noti } from '../Notifications/Noti';

import { TrendCard } from '../TrendCard/TrendCard'
import ShareModal from '../ShareModal/ShareModal'
import { logOut } from '../../actions/AuthAction'


export const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
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
    <>
        <div className="RightSide">
          <div className="navIcons">
            <Link style={{ width: "1.5rem", height: "1.5rem" }} to="/home">
              <img style={{ width: "100%", height: "100%" }} src={Home} alt="" />
            </Link>
            <span className='MuiBadge-root'>
              <UilBell style={{ cursor: "pointer" }} onClick={handleClick}/>
            <span className='MuiBadge-badge MuiBadge-standard MuiBadge-anchorOriginTopRight MuiBadge-anchorOriginTopRightRectangular MuiBadge-overlapRectangular MuiBadge-colorError css-r0ekhs'>2</span>
              </span> 
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
        <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          horizontal:"center"
        }}

      >
        <Typography sx={{ p: 2 }}>
          <div>
            <div className='notifCard' style={{cursor : 'pointer'}}>
                <Noti></Noti>
                <Noti></Noti><Noti></Noti><Noti></Noti>
            </div>
          </div>
        </Typography>
      </Popover>
    </>

  )
}
