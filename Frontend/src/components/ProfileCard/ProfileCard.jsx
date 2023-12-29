import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '@mui/material/Button';
import swal from "sweetalert";

import {userInfoStore, socketStore} from '../../store';
import message from '../../img/message.png'
import './ProfileCard.css'
import Cover from '../../img/default.jpg'
import Profile from '../../img/default.png'; 
import { alertt_success } from '../../actions/AlertAction';

import { STATUS_HANDLE_FRIEND, HANDLE_MY_PROFILE, NOTIFICATIONTYPES } from '../../helpers/helper';
import * as ContactAPI from "../../api/contactRequest" ; 
import * as AuthAPI from "../../api/AuthRequest" ; 

export const ProfileCard = ({ location }) => {

    const dispatch = useDispatch();

    const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

    const  currentUser  = JSON.parse(localStorage.getItem("profile"))

    const otherUserInfor = userInfoStore((state) => state.otherUserInfor); 
    const posts = userInfoStore((state) => state.posts)
    const socket_ = socketStore((state) => state.socket);

    let navigate = useNavigate();

    const { id } = useParams()


    const handleApproveFriend = async (eBtn) => {
        let data = await ContactAPI.approveRequestContact(currentUser.token,id )  ; 
        
        if(data){
            let newNotification = {
                type: NOTIFICATIONTYPES.APPROVE_CONTACT, 
                isRead: false, 
                idSender: currentUser.data._id, 
                contactId: id,
                firstNameSender: currentUser.data.firstName, 
                avatarSender: currentUser.data.avatar, 
                createAt: Date.now()
            }
            eBtn.target.innerText = STATUS_HANDLE_FRIEND.FRIEND ;
            eBtn.target.value = STATUS_HANDLE_FRIEND.FRIEND ;  
            socket_.emit("approve-request-contact-received", {newNotification: newNotification}) 
        }
    }

    
    const handleAddContact = async(eBtn)=> {
        const data = await ContactAPI.addContact(currentUser.token, id); //id of userr contact 
        if(data){
            let newNotification = {
                type: NOTIFICATIONTYPES.ADD_CONTACT, 
                isRead: false, 
                idSender: currentUser.data._id, 
                contactId: data.data.data.contactId,
                firstNameSender: currentUser.data.firstName, 
                avatarSender: currentUser.data.avatar, 
                createAt: data.data.data.createAt 
            }
            eBtn.target.innerText = STATUS_HANDLE_FRIEND.REQUEST_FRIEND ;
            eBtn.target.value = STATUS_HANDLE_FRIEND.REQUEST_FRIEND ;  
            socket_.emit("add-new-contact", {newNotification: newNotification}) 
        }
    }

    const handleRemoveContact = (eBtn) =>{
        swal({
            title: "Do you want to delete this contact?",
            icon: "warning",
            
            buttons: true,
            dangerMode: true,

          }).then(async (btnAction)=> {
            if(btnAction){
                const data = await ContactAPI.removeContact(currentUser.token, id); //id of userr contact 
                console.log(data); 
                if(data.data){
                    eBtn.target.innerText = STATUS_HANDLE_FRIEND.ADD_FRIEND ;
                    eBtn.target.value = STATUS_HANDLE_FRIEND.ADD_FRIEND ;  
                    dispatch(alertt_success("You have just successfully deleted this friend"));

                }
            }
          });       

    }

    const handleRemoveReqContactSent = async(eBtn) =>{
        const data = await ContactAPI.removeReqContactSent(currentUser.token, id); //id of userr contact 
        if(data.data){
            eBtn.target.innerText = STATUS_HANDLE_FRIEND.ADD_FRIEND ;
            eBtn.target.value = STATUS_HANDLE_FRIEND.ADD_FRIEND ;  

        }
        

    }

    const handleVerifyEmail = async() => {
        AuthAPI.verifyEmail(currentUser.token) ; 
    }
    const handleFriend = (e) => {
        switch (e.target.value) {
            case STATUS_HANDLE_FRIEND.ADD_FRIEND:
                handleAddContact(e) 
                break;
            case STATUS_HANDLE_FRIEND.FRIEND: // hủy kết bạn 
                handleRemoveContact(e)
                break;
            case STATUS_HANDLE_FRIEND.REQUEST_FRIEND:// 
                handleRemoveReqContactSent(e);
                break;
            case STATUS_HANDLE_FRIEND.CONFIRM_FRIEND:
                handleApproveFriend(e);
                break;
            case HANDLE_MY_PROFILE.UPDATE_PROFILE:

                break;
            case HANDLE_MY_PROFILE.VERIFY_EMAIL:
                handleVerifyEmail() ; 
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
                <img src={location === "homePage" ? currentUser.data.avatar ? process.env.REACT_APP_AVATAR_IMAGE_FOLDER  + currentUser.data.avatar : Profile :
                    otherUserInfor.avatar ? process.env.REACT_APP_AVATAR_IMAGE_FOLDER + otherUserInfor.avatar : Profile} alt='' />
            </div>
            <div className="ProfileName">
                <span>{location === "homePage" ? currentUser.data.firstName : otherUserInfor.firstName} {location === "homePage" ? currentUser.data.lastName : otherUserInfor.lastName} </span>
                <span>{location === "homePage" ? currentUser.data.workAt ? currentUser.data.workAt : "Write about yourself" : otherUserInfor.workAt ? otherUserInfor.workAt : "Write about yourself"}</span>

                {id && currentUser.data._id !== otherUserInfor._id ? <img style={{width : 20 , height : 20 , cursor : "pointer"}} src={message} onClick={handleInbox} /> : <></>}

            </div>
            <div className="FollowStatus">
                {location !== "profilePage" ? "" : 

                    <div className='action-btn-contact'>
                        { currentUser.data._id !== otherUserInfor._id ?(
                        <Button  variant="contained" onClick={handleFriend} value={otherUserInfor.statusFriend}>{otherUserInfor.statusFriend}</Button>
                        ): currentUser.data.isActive ? (
                            <></>
                            // <Button  variant="contained" onClick={handleFriend} value={HANDLE_MY_PROFILE.UPDATE_PROFILE}>Update profile</Button>
                        ):(
                        <>
                            <Button  variant="contained" onClick={handleFriend} value={HANDLE_MY_PROFILE.VERIFY_EMAIL}>Verify Email</Button>
                        </>
                         
                        )                         
                    }
                    </div>
                }

                <hr />
                <div>
                    <div className='follow'>
                        <span>12</span>
                        <span>Friends</span>
                    </div>
                    <div className='vl'></div>
                    <div className='follow'>
                        <span>hihi</span>
                        <span>Friends</span>
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
