import React from 'react'


import "./comment.css" ; 
import { convertTimestampToHumanTime } from '../../helpers/helper';

const Comment = ({ data}) => {
    return (
        <>
            <div className='card-comment-header'>
                <div className='comment-header'>
                    <img src={`${process.env.REACT_APP_AVATAR_IMAGE_FOLDER}${data.avatar}`} alt="" className='image-comment-header' />
                    <div className='detail-comment-header'>
                    <span className='user-comment'>{data.lastName}</span> <span className='content-comment'>{data.content}</span><br/>
                    <span className='createTime-comment'>{convertTimestampToHumanTime(data.creatAt)}</span>
                    </div>
                </div>
            
            </div>
        </>
    )
}

export default Comment ; 
