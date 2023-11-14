import React, { useEffect, useState } from 'react'
import "./Noti.css";

import axios from "axios"
import { useSelector } from 'react-redux'

export const Noti = () => {

  return (
        <div className='notif' style={{cursor : 'pointer'}}>
            <div>
                <img src='../../img/default.png' alt="" className='notifImg' />
                <div className='notif-title'>
                    Văn PHùng vừa gửi lời mời kết bạn..
                    <span className='notif-time'>
                        4 phuts truorwc
                    </span>
                </div>
            </div>
        </div>
  )
}
