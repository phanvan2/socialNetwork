import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Cover from '../../img/default.jpg'
import Profile from '../../img/default.png'
import './ProfileCard.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import userInfoStore from '../../store'
import message from '../../img/message.png'

export const ProfileCard = ({ location }) => {

    const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER
    const  user  = useSelector(state => state.authReducer.authData)
    console.log(useSelector(state => state.authReducer.authData))
    const otherUserInfor = userInfoStore((state) => state.otherUserInfor)
    const userInfo = userInfoStore((state) => state.userInfo)
    const posts = userInfoStore((state) => state.posts)

    let navigate = useNavigate();

    const { id } = useParams()

    const handleInbox = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/chat`, {
            senderId: user._id,
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
                <img src={location === "homePage" ? userInfo.coverPicture ? publicFolder + userInfo.coverPicture : Cover :
                    otherUserInfor.coverPicture ? publicFolder + otherUserInfor.coverPicture : Cover} alt='' />
                <img src={location === "homePage" ? userInfo.profilePicture ? publicFolder + userInfo.profilePicture : Profile :
                    otherUserInfor.profilePicture ? publicFolder + otherUserInfor.profilePicture : Profile} alt='' />
            </div>
            <div className="ProfileName">
                <span>{location === "homePage" ? userInfo.firstname : otherUserInfor.firstname} {location === "homePage" ? userInfo.lastname : otherUserInfor.lastname}</span>
                <span>{location === "homePage" ? userInfo.workAt ? userInfo.workAt : "Write about yourself" : otherUserInfor.workAt ? otherUserInfor.workAt : "Write about yourself"}</span>

                {id && user._id !== otherUserInfor._id ? <img style={{width : 20 , height : 20 , cursor : "pointer"}} src={message} onClick={handleInbox} /> : <></>}

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
                <Link style={{ textDecoration: "none", color: "inherit" }} to={`/profile/${user._id}`}> My profile</Link>
            </span>}
        </div>
    )
}
