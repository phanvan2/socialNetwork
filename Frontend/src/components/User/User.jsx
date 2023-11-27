import axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Badge from '@mui/material/Badge';

import "./User.css";
import ProfileImage from '../../img/default.png'; 

export const User = ({ person }) => {
    const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER
    const { user } = useSelector((state) => state.authReducer.authData)

    let navigate = useNavigate();
    const sendToProfile = () => {
        let path = `/profile/${person._id}`;
        navigate(path);
    }


    return (
        <div>
            <div className='follower' style={{cursor : 'pointer'}}>
                <div onClick={sendToProfile}>
                <img src={person.profilePicture ? publicFolder + person.profilePicture : ProfileImage} alt="" className='followerImg' />


                    <div className='name'>
                        <span>{person.firstName + " " + person.lastName}</span>
                        <span className='status-user user-offline' id={`user${person._id}`}>offline</span>

                    </div>
                </div>
              
            </div>
        </div>
    )
}
