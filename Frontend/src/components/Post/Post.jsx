import React, { useState } from 'react'
import './Post.css'

import Comment from '../../img/comment.png'
import Share from '../../img/share.png'
import Like from '../../img/like.png'
import NotLike from '../../img/notlike.png'
import { useSelector } from 'react-redux'
import { likePost } from '../../api/PostRequest'
import { UilMessage } from '@iconscout/react-unicons'
import axios from 'axios'; 
import { useParams } from 'react-router-dom'

import {userInfoStore} from '../../store';

import { convertTimestampToHumanTime } from '../../helpers/helper'

export const Post = ({ data, location=null }) => {
  
  const [hideInputCmt, setHideInputCmt] = useState(false)
  const  user  = useSelector((state) => state.authReducer.authData)
  const [liked, setLiked] = useState()
  const [likes, setLikes] = useState()
  const [contentCmt, setContentCmt] = useState()
  const [listCmt , setListCmt] = useState([])
  const userInfo = userInfoStore((state) => state.userInfo)



  const handleLiked = (e) => {
    setLiked((prev) => !prev)
    likePost(data._id, user._id)
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1)
  }

  const handleChangeInputCmt = (e) => {
    setContentCmt(e.target.value)
    console.log(contentCmt);
  }

  const handleSubmitCmt = () => {
    const newComment = {
      idUserComment: userInfo._id,
      nameUser: userInfo.username,
      content: contentCmt
    }
    axios.post(process.env.REACT_APP_API_URL + '/post/' + data._id + "/comment",newComment)
      .then(function (response) {
        setContentCmt("")
        setListCmt([...listCmt , newComment])
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }


  return (
    <div className='Post'>
        <div className='card-post-header'>
          <div className='post-header'>
            <img src={`http://localhost:5000/images/posts/${data.image}`} alt="" className='image-post-header' />
            <div className='detail-post-header'>
              <span className='desc-post'>{data.lastName}</span><br/>
              <span className='createTime-post'>{convertTimestampToHumanTime(`${data.creatAt}`)}</span>
            </div>
          </div>
        
        </div>  
      <span>{data.desc}</span>

      <img src={data.image ? "http://localhost:5000/images/posts/" + data.image : ""} alt="" />

      <div className="postReact">
        <div>         
          <img src={liked ? Like : NotLike} alt="" style={{ "cursor": "pointer" }} onClick={handleLiked} />
          <p style={{ color: "var(--gray)", fontSize: "12px", textAlign:"center", margin:"2px" }}>{likes} 12</p>


        </div>
        <div>         
          <img src={Comment} alt="" onClick={() => setHideInputCmt((prev) => !prev)} />
          <p style={{ fontSize: "12px",  color: "var(--gray)",textAlign:"center", margin:"2px" }}>2.5k</p>

        </div>
        <div>         
          <img src={Share} alt="" />
        </div>

      </div>

      {hideInputCmt && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <input type="text" placeholder='Comment' onChange={handleChangeInputCmt} value={contentCmt} />
          <UilMessage onClick={handleSubmitCmt} />
        </div>
      )}

      <div>
        {listCmt.map((cmt, id) => {
          return (
            <div style={{
              display: "flex",
              flexDirection: "row",
              margin: "10px"
            }}>
              <span style={{ fontWeight: "bold" }}>@{cmt.nameUser}  </span>
              <span>{cmt.content}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
