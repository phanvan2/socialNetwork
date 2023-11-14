import React, { useEffect } from 'react'
import './Home.css'
import ProfileSide from '../../components/profileSide/ProfileSide'
import PostSide from '../../components/PostSide/PostSide'
import { RightSide } from '../../components/RightSide/RightSide'
import {userInfoStore} from '../../store';
import axios from 'axios'
import { useSelector } from 'react-redux'

export const Home = () => {
  const user  = useSelector((state) => state.authReducer.authData)
  const setPosts = userInfoStore((state) => state.setPosts)
  const setUserInfo = userInfoStore((state) => state.setUserInfo)
  const posts = userInfoStore((state) => state.posts)
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + `/post/${user._id}/timeline`)
      .then(res => {
        if (res.data) {
          setPosts(res.data.pop().followingPosts)
        }
      })
      .catch(error => console.log(error));

      axios.get(process.env.REACT_APP_API_URL + `/user/${user._id}`)
      .then(res => {
        setUserInfo(res.data)
        
      })
      .catch(error => console.log(error));
  }, [])

  return (
    <div className='Home'>
      <ProfileSide location="homePage" />
      <PostSide location="homePage" />
      <RightSide />
    </div>
  )
}
