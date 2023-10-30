import React, { useEffect, useState } from 'react'
import './Posts.css'
import { Post } from '../Post/Post'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { useParams } from 'react-router-dom'
import userInfoStore from '../../store'

const Posts = ({ location }) => {
  const posts = userInfoStore((state) => state.posts)
 
  return (
    <div className='Posts'>
      {posts.map((post, id) => {
        return <Post data={post} id={id} />
      })}
    </div>
  )
}

export default Posts
