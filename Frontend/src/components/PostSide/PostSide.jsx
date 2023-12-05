import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Posts from '../Posts/Posts'
import PostShare from '../PostShare/PostShare'
import './PostSide.css'

const PostSide = ({location}) => {
  
  const user  = useSelector((state) => state.authReducer.authData)
  const {id} = useParams()

  return (
    <div className='PostSide'>
      {!id ? <PostShare /> : user._id === id ? <PostShare /> : <></>}
      <Posts location={location}/>
    </div>
  )
}

export default PostSide
