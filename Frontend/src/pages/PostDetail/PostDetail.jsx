import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { ProfileLeft } from '../../components/ProfileLeft/ProfileLeft'
import { RightSide } from '../../components/RightSide/RightSide'

import * as PostAPI from "../../api/PostRequest" ; 
import { Post } from '../../components/Post/Post'


export const PostDetail = () => {
  const { idPost } = useParams();
  const [post1 , setPost] = useState(null)

  let uploadPostDetail = async(idPost) =>{
    let result_post = await PostAPI.getPostsByIdPost(idPost) ;
    if(result_post.data){
      setPost(result_post.data); 
    }
  }

  useEffect(() => {
    uploadPostDetail(idPost);

  }, [idPost])

  return (
    <div className="Profile">
      <ProfileLeft />
      <div className="Profile-center">
        
        {post1 !== null? (
          <Post data={post1} location={"postDetail"}/>

        ): (<></>)}
      </div>
      <RightSide />
    </div>
  )
}
