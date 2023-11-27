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
import DialogContent from '@mui/material/DialogContent';
import Badge from '@mui/material/Badge';
import { orange } from '@mui/material/colors';
import Stack from '@mui/material/Stack';


import { TrendCard } from '../TrendCard/TrendCard'
import ShareModal from '../ShareModal/ShareModal'
import { logOut } from '../../actions/AuthAction'
import * as notifiAPI from "../../api/notifiRequest"; 
import {notificationStore} from "../../store";

export const RightSide = () => {

  const dispatch = useDispatch();

  const [modalOpened, setModalOpened] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const setNotification = notificationStore((state)=> state.setNotification);
  const notifications = notificationStore((state)=> state.notifications);

  const currentUser = JSON.parse(localStorage.getItem("profile"))

  const color = orange[500];


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

    const getNotification = async(User) => {

      if(User){
        let data = await notifiAPI.getNotification(0, User.token); 
        if(data.data)
          if(data.data.data)
            setNotification(data.data.data);
     
      }
    }

    React.useEffect(() => {
      getNotification(currentUser); 
    }, []);
  return (
    <>
        <div className="RightSide">
          <div className="navIcons">
            <Link style={{ width: "1.5rem", height: "1.5rem" }} to="/home">
              <img style={{ width: "100%", height: "100%" }} src={Home} alt="" />
            </Link>
            {/* <span className='MuiBadge-root'> */}

            <Badge badgeContent={notifications.length} sx={{color: color}}  color="primary">

              <UilBell style={{ cursor: "pointer" }} onClick={handleClick} />
              </Badge>


            {/* <span className='MuiBadge-badge MuiBadge-standard MuiBadge-anchorOriginTopRight MuiBadge-anchorOriginTopRightRectangular MuiBadge-overlapRectangular MuiBadge-colorError css-r0ekhs'>2</span>
              </span>  */}
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
        <Typography sx={{ p: 2 }}  >
           
            <DialogContent style={{height:"500px",     padding: "5px 4px"}}>
            <div className='notifCard' style={{cursor : 'pointer'}}>
              {notifications? (notifications.length !== 0 ?notifications.map((notification, index) => (
                <Noti key={index} notification={notification}></Noti>
              )): (
                  <div style={{height: "500px"}}><span>Không có thông báo nào</span></div>
                  )): (<div><span>Không có thông báo nào</span></div>)}
             
            </div>
            </DialogContent>
        </Typography>
      </Popover>
    </>

  )
}
