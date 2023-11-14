import React, { useEffect, useState } from 'react'
import './ProfileModal.css'
import { Modal, useMantineTheme } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {uploadImage} from '../../actions/UploadAction'
import { updateUser } from '../../actions/UserAction';
import {userInfoStore} from '../../store';

const ProfileModal = ({ modalOpened, setModalOpened, data }) => {
    const theme = useMantineTheme();
    const { password, ...other } = data;
    const [formData, setFormData] = useState(other)
    const [profileImage, setProfileImage] = useState(null)
    const [coverImage, setCoverImage] = useState(null)
    const dispatch = useDispatch()
    const { id } = useParams()
    const user  = useSelector((state) => state.authReducer.authData)
    console.log("oke"); 
    console.log(user) ; 
    const otherUserInfor = userInfoStore((state) => state.otherUserInfor)
    const setOtherUserInfo = userInfoStore((state) => state.setOtherUserInfo)

    useEffect(()=>{
        setFormData(otherUserInfor)
    },[id])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onImageChange = (e) =>{
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0]
            e.target.name = "profilePicture"
            ? setProfileImage(img)
            : setCoverImage(img)
        }
    }

    
    const handleSubmit = (e)=>{
        e.preventDefault();
        let UserData = formData
        if (profileImage) {
            const data = new FormData()
            const fileName = Date.now() + profileImage.name
            data.append("name" , fileName)
            data.append("file" , profileImage)
            UserData.profilePicture = fileName

            try {
                dispatch(uploadImage(data))
            } catch (error) {
                console.log(error);
            }
        }
        setOtherUserInfo(UserData)
        UserData.currentUserId = user._id
        dispatch(updateUser(id , UserData))
        setModalOpened(false)
    }
    return (
        <Modal
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.55}
            overlayBlur={3}
            size="55%"
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
        >
            {/* Modal content */}
            <form className='infoForm' action="">
                <h3>Your infor</h3>
                <div>
                    <input type="text"
                        className='infoInput'
                        name='firstname'
                        placeholder='First Name'
                        onChange={handleChange}
                        value={formData.firstname}
                    />
                    <input type="text"
                        className='infoInput'
                        name='lastname'
                        placeholder='Last Name'
                        onChange={handleChange}
                        value={formData.lastname}
                    />
                </div>
                <div>
                    <input type="text"
                        className='infoInput'
                        name='livesin'
                        placeholder='Lives In'
                        onChange={handleChange}
                        value={formData.livesin}
                    />
                    <input type="text"
                        className='infoInput'
                        name='country'
                        placeholder='Country'
                        onChange={handleChange}
                        value={formData.country}
                    />
                </div>
                <div>
                    <input type="text"
                        className='infoInput'
                        name='workAt'
                        placeholder='workAt'
                        onChange={handleChange}
                        value={formData.workAt}
                    />
                    <input type="text"
                        className='infoInput'
                        name='relationship'
                        placeholder='Relationship Status'
                        onChange={handleChange}
                        value={formData.relationship}
                    />
                </div>
                <div>
                    Profile Image
                    <input type="file" name='profilePicture' onChange={onImageChange}/>
                    Cover Image
                    <input type="file" name='coverPicture' onChange={onImageChange}/>
                </div>
                <button className='button infoButton' onClick={handleSubmit}>Update</button>
            </form>
        </Modal>
    )
}

export default ProfileModal
