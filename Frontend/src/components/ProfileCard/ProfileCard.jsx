import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Cover from '../../img/default.jpg'
import Profile from '../../img/default.png'
import './ProfileCard.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import {userInfoStore} from '../../store';
import message from '../../img/message.png'

export const ProfileCard = ({ location }) => {

    const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER
    const  currentUser  = useSelector(state => state.authReducer.authData).data ; 
    console.log(currentUser);
    const otherUserInfor = userInfoStore((state) => state.otherUserInfor)
    const userInfo = userInfoStore((state) => state.userInfo);
    console.log(location);
    const posts = userInfoStore((state) => state.posts)

    let navigate = useNavigate();

    const { id } = useParams()

    const handleInbox = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/chat`, {
            senderId: currentUser._id,
            receiverId: id
        })
            .then(function (response) {
                let path = `/chat/${id}`;
                navigate(path);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })


    }

    return (
        <div className="ProfileCard">
            <div className="ProfileImages">
                <img src={location === "homePage" ? currentUser.coverPicture ? publicFolder + currentUser.coverPicture : Cover :
                    otherUserInfor.coverPicture ? publicFolder + otherUserInfor.coverPicture : Cover} alt='' />
                <img src={location === "homePage" ? currentUser.profilePicture ? publicFolder + currentUser.profilePicture : Profile :
                    currentUser.profilePicture ? publicFolder + currentUser.profilePicture : Profile} alt='' />
            </div>
            <div className="ProfileName">
                <span>{location === "homePage" ? currentUser.firstName : otherUserInfor.firstName} {location === "homePage" ? currentUser.lastName : otherUserInfor.lastName} </span>
                <span>{location === "homePage" ? userInfo.workAt ? userInfo.workAt : "Write about yourself" : otherUserInfor.workAt ? otherUserInfor.workAt : "Write about yourself"}</span>

                {id && currentUser._id !== otherUserInfor._id ? <img style={{width : 20 , height : 20 , cursor : "pointer"}} src={message} onClick={handleInbox} /> : <></>}

            </div>
            <div className="FollowStatus">
                <hr />
                <div>
                    <div className='follow'>
                        <span>{location === "homePage" ? userInfo.following ? userInfo.following.length : "0" : otherUserInfor.following ? otherUserInfor.following.length : "0"}</span>
                        <span>Followings</span>
                    </div>
                    <div className='vl'></div>
                    <div className='follow'>
                        <span>{location === "homePage" ? userInfo.followers ? userInfo.followers.length : "0" : otherUserInfor.followers ? otherUserInfor.followers.length : "0"}</span>
                        <span>Followers</span>
                    </div>

                    {location === "profilePage" && (
                        <>
                            <div className='vl'>

                            </div>
                            <div className="follow">
                                <span>{posts ? posts.length : "0"}</span>
                                <span>Posts</span>
                            </div>
                        </>
                    )}
                </div>
                <hr />
            </div>
            {location === "profilePage" ? "" : <span>
                <Link style={{ textDecoration: "none", color: "inherit" }} to={`/profile/${currentUser._id}`}> My profile</Link>
            </span>}
        </div>
    )
}
