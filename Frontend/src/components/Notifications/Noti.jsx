import React from 'react'
import "./Noti.css";

import { useNavigate } from 'react-router-dom'


import { convertTimestampToHumanTime, NOTIFICATIONTYPES } from '../../helpers/helper';

import ProfileImage from '../../img/default.png'

export const Noti = (props) => {
    let notification = props.notification; 
    console.log(notification) ; 
    let navigate = useNavigate();

    const sendToProfile = (userIđ) => {
        let path = `/profile/${userIđ}`;
        navigate(path);
    }

  return (
        <div className='notif' style={{cursor : 'pointer'}}>
            {(notification.type === NOTIFICATIONTYPES.ADD_CONTACT) ?(
                <div onClick={()=> sendToProfile(notification.idSender)}>
                    <img src={process.env.REACT_APP_AVATAR_IMAGE_FOLDER+notification.avatarSender} alt="" className='notifImg' />
                    <div className='notif-title'>
                        <span>{notification.firstNameSender} just sent a friend request.</span>
                        <span className='notif-time'>
                            {convertTimestampToHumanTime(notification.createAt)}
                        </span>
                    </div>
                </div>
            ):(notification.type === NOTIFICATIONTYPES.APPROVE_CONTACT) ? (
                <div>
                    <img src={process.env.REACT_APP_AVATAR_IMAGE_FOLDER+notification.avatarSender} alt="" className='notifImg' />
                    <div className='notif-title'>
                        <span>{notification.firstNameSender} accepted your friend request.</span>
                        <span className='notif-time'>
                            {convertTimestampToHumanTime(notification.createAt)}
                        </span>
                    </div>
                </div>
            ):(notification.type === NOTIFICATIONTYPES.MENTION_YOU) ? (
                <div>
                    <img src={process.env.REACT_APP_AVATAR_IMAGE_FOLDER+notification.avatarSender} alt="" className='notifImg' />
                    <div className='notif-title'>
                        <span>{notification.firstNameSender}  mentioned you in a comment.</span>
                        <span className='notif-time'>
                            {convertTimestampToHumanTime(notification.createAt)}
                        </span>
                    </div>
                </div> 
            ):(notification.type === NOTIFICATIONTYPES.REGISTER_SUCCESS) ? (
                <div>
                    <img src={process.env.REACT_APP_AVATAR_IMAGE_FOLDER+notification.avatarSender} alt="" className='notifImg' />
                    <div className='notif-title'>
                        <span>Congratulations, you have successfully registered an account. Please activate your account.....</span>
                        <span className='notif-time'>
                            {convertTimestampToHumanTime(notification.createAt)}
                        </span>
                    </div>
                </div> 
            ):<div></div>}


        </div>
  )
}

