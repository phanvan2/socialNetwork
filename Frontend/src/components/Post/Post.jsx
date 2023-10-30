import React, { useState } from 'react'
import './Post.css'

import Comment from '../../img/comment.png'
import Share from '../../img/share.png'
import Like from '../../img/like.png'
import NotLike from '../../img/notlike.png'
import { useSelector } from 'react-redux'
import { likePost } from '../../api/PostRequest'
import { UilMessage } from '@iconscout/react-unicons'
import axios from 'axios'
import userInfoStore from '../../store'

export const Post = ({ data }) => {
  const [hideInputCmt, setHideInputCmt] = useState(false)
  const  user  = useSelector((state) => state.authReducer.authData)
  const [liked, setLiked] = useState(data.likes.includes(user._id))
  const [likes, setLikes] = useState(data.likes.length)
  const [contentCmt, setContentCmt] = useState()
  const [listCmt , setListCmt] = useState(data.comment ? data.comment : [])
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
      <img src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""} alt="" />

      <div className="postReact">
        <img src={liked ? Like : NotLike} alt="" style={{ "cursor": "pointer" }} onClick={handleLiked} />
        <img src={Comment} alt="" onClick={() => setHideInputCmt((prev) => !prev)} />
        <img src={Share} alt="" />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>{likes} Likes</span>

      <div className="detail">
        <span><b>{data.name}</b></span>
        <span>{data.desc}</span>
      </div>
      <span style={{ fontSize: "20px", fontWeight: "bold" }}>Comment</span>
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
