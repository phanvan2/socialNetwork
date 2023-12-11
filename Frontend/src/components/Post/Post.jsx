import React, { useState } from 'react'
import './Post.css'
import { useSelector } from 'react-redux'
import { UilMessage } from '@iconscout/react-unicons'
import { useNavigate } from 'react-router-dom'

import CommentImg from '../../img/comment.png'
import Share from '../../img/share.png'
import Like from '../../img/like.png'
import NotLike from '../../img/notlike.png'

import {userInfoStore} from '../../store';
import { convertTimestampToHumanTime } from '../../helpers/helper'
import { addLike ,removeLike, getLikesbyPost, getInforLike} from '../../api/LikeRequest' ;
import * as CommentAPI from "../../api/CommentRequest"; 
import Comment from "../../components/Comment/Comment" ; 
import swal from 'sweetalert'




export const Post = ({ data, location=null }) => {

  let navigate = useNavigate();
  
  const [hideInputCmt, setHideInputCmt] = useState(false)
  const  user  = useSelector((state) => state.authReducer.authData)
  const [liked, setLiked] = useState(0)
  const [likes, setLikes] = useState(0)
  const [contentCmt, setContentCmt] = useState()
  const [listCmt , setListCmt] = useState([])


  const handleLiked = (e) => {
    console.log(liked)
    if(liked === 0){
      addLike(user.token, data._id)
      setLikes((prev) => prev + 1)
      setLiked(1)
    }else{
      removeLike(user.token, data._id)
      setLikes((prev) => prev - 1)
      setLiked(0)
    }
    return ; 
  }

  const handleChangeInputCmt = (e) => {
    setContentCmt(e.target.value)
  }

  const handleSubmitCmt = async() => {
    const newComment = {
      user_token: user.token,
      postId: data._id,
      content: contentCmt,
      avatar: user.data.avatar,
      creatAt: Date.now (),
      firstName: user.data.firstName,
      lastName: user.data.lastName,
      userId: user.data.userId
    }

    
    let result = await CommentAPI.addComment(newComment);
    if(result){
    
      setListCmt([newComment, ...listCmt])
    }else{
      swal({
        title: "Sorry Try again later, Please",
        icon: "error",
        button: "OK!",
      });
    }
    return;

  
  }

  const sendToPost = (postId) => {
    if(location !== "postDetail"){
      let path = `/post/${postId}`;
      navigate(path);
    }

  }
  let handleGetComment = async(idPost) => {
    let result = await CommentAPI.getCommentsByIdPost(idPost) ; 
    setListCmt(result.data) ;

  }
  let handleGetQuanityLikes = async(idPost) =>{
    let tokenUser  = null; 
    try {
      tokenUser = user.token ; 
    } catch (error) {
      
    }
      let result = await getInforLike(idPost, tokenUser) ; 
    
    if(result){
      console.log(result) ; 
      setLiked(result.data.checkLike)
      setLikes(result.data.quanityLike)
    }

  }
  React.useEffect(() => {
    handleGetComment(data._id) ;
    handleGetQuanityLikes(data._id) ;
  }, [data._id])

  return (
    <div className='Post'  onClick={()=> sendToPost(data._id) }>
        <div className='card-post-header'>
          <div className='post-header'>
            <img src={`${process.env.REACT_APP_AVATAR_IMAGE_FOLDER}${data.avatar}`} alt="" className='image-post-header' />
            <div className='detail-post-header'>
              <span className='desc-post'>{data.lastName}</span><br/>
              <span className='createTime-post'>{convertTimestampToHumanTime(`${data.creatAt}`)}</span>
            </div>
          </div>
        
        </div>  
      <span>{data.desc}</span>

      <img src={data.image ? `${process.env.REACT_APP_POSTS_IMAGE_FOLDER}` + data.image : ""} alt="" />

      <div className="postReact">
        <div>         
          <img src={liked == 1 ? Like : NotLike} alt="" style={{ "cursor": "pointer" }} onClick={handleLiked} />
          <p style={{ color: "var(--gray)", fontSize: "12px", textAlign:"center", margin:"2px" }}>{likes}</p>


        </div>
        <div>         
          <img src={CommentImg} alt="" onClick={() => setHideInputCmt((prev) => !prev)} />
          <p style={{ fontSize: "12px",  color: "var(--gray)",textAlign:"center", margin:"2px" }}>{listCmt.length}</p>

        </div>
        <div>         
          <img src={Share} alt="" />
        </div>

      </div>

      {hideInputCmt && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding:"3px",
          gap: "10px"

        }}>
                    <img src={`${process.env.REACT_APP_AVATAR_IMAGE_FOLDER}${data.avatar}`} alt="" className='img-input-comment' />

          <input type="text" placeholder='Comment' onChange={handleChangeInputCmt} value={contentCmt} />
          <UilMessage onClick={handleSubmitCmt} />
        </div>
      )}

        {location === "postDetail" ?(listCmt.map((cmt, id) => {
          return (
            <div style={{"display": "contents"}}>
              <Comment key={id} data={cmt} />
            </div>
          
          )
        })): <></>}
    </div>
  )
}
