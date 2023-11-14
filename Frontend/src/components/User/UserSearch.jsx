import axios from 'axios'
import React, { useState } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ProfileImage from '../../img/default.png'
import { socketStore } from '../../store.js';
import * as ContactApi from "../../api/contactRequest.js"

const  UserSearch = (props) => {
    const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
    const contactUser = props.contactUser;
    const socket_ = socketStore((state) => state.socket);

    const user  = useSelector((state) => state.authReducer.authData)
    // const [following, setFollowing] = useState(person.followers.includes(user._id))
    // const handleFollow = () => {
    //     let strFollow = following ? "unfollow" : "follow"

    //     axios.put(process.env.REACT_APP_API_URL + `/user/${person._id}/${strFollow}`, { currentUserId: user._id })
    //         .then(res => {
    //             console.log(res.data);
    //         })
    //         .catch(error => console.log(error));

    //     setFollowing((pev) => !pev)
    // }
    let navigate = useNavigate();
    const sendToProfile = (_id) => {
        console.log(_id);
        let path = `/profile/${_id}`;
        navigate(path);
    }

    const handleAddContact = async(contactId)=> {
        const data = await ContactApi.addContact(user.token, contactId);
        if(data){
            socket_.emit("add-new-contact", {contactId: contactId}) 
        }
    }
    return (
        <div>
            <div className='follower' style={{cursor : 'pointer'}}>
                <div onClick={()=> sendToProfile(contactUser._id)} id={contactUser._id}  name={contactUser._id}>
                    <img src={ProfileImage} alt="" className='followerImg' />
                    <div className='name'>
                        <span>{contactUser.lastName}</span>
                        <span>{contactUser.email}</span>
                    </div>
                </div>
                <button className='button followButton' onClick={()=> handleAddContact(contactUser._id)}>
                    Add friend
                </button>
            </div>
        </div>
    )
}

export default UserSearch ; 
