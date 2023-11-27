import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from "axios"; 
import Button from '@mui/material/Button';

import {userInfoStore, socketStore} from '../../store';
import message from '../../img/message.png'
import './ProfileCard.css'
import Cover from '../../img/default.jpg'
import Profile from '../../img/default.png'; 
import { STATUS_HANDLE_FRIEND } from '../../helpers/helper';
import * as ContactAPI from "../../api/contactRequest" ; 
import { NOTIFICATIONTYPES } from '../../helpers/helper.js'

export const ProfileCard = ({ location }) => {

    const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

    const  currentUser  = useSelector(state => state.authReducer.authData) ; 
    const userInfo = userInfoStore((state) => state.userInfo);
    const otherUserInfor = userInfoStore((state) => state.otherUserInfor); 
    const posts = userInfoStore((state) => state.posts)
    const socket_ = socketStore((state) => state.socket);

    let navigate = useNavigate();

    const { id } = useParams()


    const handleApproveFriend = async () => {
        console.log("confirm friend qq") ;
        let data = await ContactAPI.approveRequestContact(currentUser.token,id )  ; 
        if(data){
            console.log(data); 
            let newNotification = {
                type: NOTIFICATIONTYPES.APPROVE_CONTACT, 
                isRead: false, 
                idSender: currentUser.data._id, 
                contactId: id,
                firstNameSender: currentUser.data.firstName, 
                avatarSender: currentUser.data.avatar, 
                createAt: Date.now()
            }
            socket_.emit("approve-request-contact-received", {newNotification: newNotification}) 
        }
        console.log(data) ;
    }
    const handleFriend = (e) => {
        switch (e.target.value) {
            case STATUS_HANDLE_FRIEND.ADD_FRIEND:
                
                break;
            case STATUS_HANDLE_FRIEND.FRIEND:
            
                break;
            case STATUS_HANDLE_FRIEND.REQUEST_FRIEND:

                break;
            case STATUS_HANDLE_FRIEND.CONFIRM_FRIEND:
                handleApproveFriend();
                break;
        
            default:
                break;
        }
    }


    const handleInbox = () => {
        // axios.post(`${process.env.REACT_APP_API_URL}/chat`, {
        //     senderId: currentUser._id,
        //     receiverId: id
        // })
        //     .then(function (response) {
        //         let path = `/chat/${id}`;
        //         navigate(path);
        //     })
        //     .catch(function (error) {
        //         // handle error
        //         console.log(error);
        //     })


    }

    return (
        <div className="ProfileCard">
            <div className="ProfileImages">
                <img src={location === "homePage" ? currentUser.data.coverPicture ? publicFolder + currentUser.data.coverPicture : Cover :
                    otherUserInfor.coverPicture ? publicFolder + otherUserInfor.coverPicture : Cover} alt='' />
                <img src={location === "homePage" ? currentUser.data.profilePicture ? publicFolder + currentUser.data.profilePicture : Profile :
                    currentUser.data.profilePicture ? publicFolder + currentUser.data.profilePicture : Profile} alt='' />
            </div>
            <div className="ProfileName">
                <span>{location === "homePage" ? currentUser.data.firstName : otherUserInfor.firstName} {location === "homePage" ? currentUser.data.lastName : otherUserInfor.lastName} </span>
                <span>{location === "homePage" ? userInfo.workAt ? userInfo.workAt : "Write about yourself" : otherUserInfor.workAt ? otherUserInfor.workAt : "Write about yourself"}</span>

                {id && currentUser.data._id !== otherUserInfor._id ? <img style={{width : 20 , height : 20 , cursor : "pointer"}} src={message} onClick={handleInbox} /> : <></>}

            </div>
            <div className="FollowStatus">
                {location !== "profilePage" ? "" : 

                    <div className='action-btn-contact'>
                        { currentUser.data._id !== otherUserInfor._id ?(
                        <Button  variant="contained" onClick={handleFriend} value={otherUserInfor.statusFriend}>{otherUserInfor.statusFriend}</Button>
                        ):(<></>)                           
                    }

                    </div>
                }

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
                <Link style={{ textDecoration: "none", color: "inherit" }} to={`/profile/${currentUser.data._id}`}> My profile</Link>
            </span>}
        </div>
    )
}
