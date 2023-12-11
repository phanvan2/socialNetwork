import React, { useState } from 'react'
import './InfoCard.css'
import { UilPen } from '@iconscout/react-unicons'
import ProfileModal from '../ProfileModal/ProfileModal';
import { useParams } from "react-router-dom"
import { useSelector } from 'react-redux'
import {userInfoStore} from '../../store';

export const InfoCard = () => {

    const [modalOpened, setModalOpened] = useState(false);
    const params = useParams();
    const user  = useSelector((state) => state.authReducer.authData)
    const profileUserId = params.id ; 

    
    const otherUserInfor = userInfoStore((state) => state.otherUserInfor)


    return (
        <div className="InfoCard">
            <div className="InfoHead">
                <h4>Profile Info</h4>
                {user.data._id === profileUserId ? (
                    <div>
                        <UilPen width='2rem' height='1.2rem' onClick={() => setModalOpened(true)} />
                        <ProfileModal modalOpened={modalOpened} setModalOpened={setModalOpened} data={user.data}/>
                    </div>
                ) : ""}

            </div>
            <div className="info">
                <span>
                    <b>Relationship </b> <span>{user.data.relationship}</span>
                </span>
             

            </div>

            <div className="info">
                <span>
                    <b>Country </b><span>{user.data.country}</span>
                </span>
               
            </div>

            <div className="info">
                <span>
                    <b>Live in </b><span>{user.data.livesin}</span>
                </span>
               
            </div>
            <div className="info">
                <span>
                    <b>Works at </b><span>{user.data.workAt}</span>
                </span>
             
            </div>
        </div>
    )
}
