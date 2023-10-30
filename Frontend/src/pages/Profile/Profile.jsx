import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PostSide from '../../components/PostSide/PostSide'
import { ProfileCard } from '../../components/ProfileCard/ProfileCard'
import { ProfileLeft } from '../../components/ProfileLeft/ProfileLeft'
import { RightSide } from '../../components/RightSide/RightSide'
import userInfoStore from '../../store'
import './Profile.css'

export const Profile = () => {
  const setOtherUserInfo = userInfoStore((state) => state.setOtherUserInfo)
  const setPosts = userInfoStore((state) => state.setPosts)
  const { id } = useParams();
  const [loadPage , setLoadPage] = useState(0)

  

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + `/user/${id}`)
      .then(res => {
        setOtherUserInfo(res.data)
      })
      .catch(error => console.log(error));

    axios.get(process.env.REACT_APP_API_URL + `/post/${id}/timeline`)
      .then(res => {
        res.data.pop();
        setPosts(res.data)
      })
      .catch(error => console.log(error));
  }, [id])

  return (
    <div className="Profile">
      <ProfileLeft />
      <div className="Profile-center">
        <ProfileCard location="profilePage" />
        <PostSide location="profilePage" />
      </div>

      <RightSide />
    </div>
  )
}
