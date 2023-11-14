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
    const profileUserId = params.id
    
    const otherUserInfor = userInfoStore((state) => state.otherUserInfor)

    return (
        <div className="InfoCard">
            <div className="InfoHead">
                <h4>Profile Info</h4>
                {user._id === profileUserId ? (
                    <div>
                        <UilPen width='2rem' height='1.2rem' onClick={() => setModalOpened(true)} />
                        <ProfileModal modalOpened={modalOpened} setModalOpened={setModalOpened} data={user}/>
                    </div>
                ) : ""}

            </div>
            <div className="info">
                <span>
                    <b>Status </b>
                </span>
                {otherUserInfor.relationship ? (
                    <span>{otherUserInfor.relationship}</span>
                ) : ""}

            </div>

            <div className="info">
                <span>
                    <b>Country </b>
                </span>
                {otherUserInfor.country ? (
                    <span>{otherUserInfor.country}</span>
                ) : ""}
            </div>

            <div className="info">
                <span>
                    <b>Live in </b>
                </span>
                {otherUserInfor.livesin ? (
                    <span>{otherUserInfor.livesin}</span>
                ) : ""}
            </div>
            <div className="info">
                <span>
                    <b>Works at </b>
                </span>
                {otherUserInfor.workAt ? (
                    <span>{otherUserInfor.workAt}</span>
                ) : ""}
            </div>
        </div>
    )
}
