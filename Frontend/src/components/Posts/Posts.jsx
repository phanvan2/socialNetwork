import React, { useEffect, useState } from 'react'
import './Posts.css'
import { Post } from '../Post/Post'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { useParams } from 'react-router-dom'
import {userInfoStore, postsProfile} from '../../store';

const Posts = ({ location }) => {

  const posts = userInfoStore((state) => state.posts) ; 
  const postsProfile1 = postsProfile((state) => state.postsProfile);

  return (
    <div className='Posts'>
      { location=== "homePage" ? 
        (posts.map((post, id) => {
          return <Post data={post} id={id} />
        })): 
        (postsProfile1.map((post, id) => {
          return <Post data={post} id={id} />}))
      }
    </div>
  )
}

export default Posts
