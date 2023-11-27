import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'; 
import { User } from '../User/User'

import './FollowersCard.css'; 
import { getListFriend } from '../../api/contactRequest';
import { friendsStore, friendsOnlineStore} from '../../store';

export const FollowersCard = () => {
  // const [friends , setFriends] = useState([])
  const currentUser  = useSelector((state) => state.authReducer.authData)
  const friends  = friendsStore((state) => state.friends)
  const setFriends = friendsStore((state)=> state.setFriends)
  const friendsOnline = friendsOnlineStore((state)=> state.friendsOnline) ; 




  useEffect(()=>{
    getListFriend(currentUser.token)
    .then(res => {
      setFriends(res.data)
    })
    .catch(error => console.log(error));
  },[])

  React.useEffect(() => {        

    const x = document.querySelectorAll(`span.status-user`); 
    x.forEach(value => {
      value.classList.remove("user-online")
      value.classList.add( "user-offine");
      value.innerHTML = "offline" ;
  
      friendsOnline.forEach(userId => {
        if(value.id == `user${userId}`){
          value.classList.remove("user-offline")
          value.classList.add( "user-online");
          value.innerHTML = "online" ;
          
        }
      })

    });
    }, [friendsOnline]);
  
  return (
    <div className='FollowersCard'>
        <h3>Friends</h3>

        {friends.map((friend , id) => {
            return (
                    <User person={friend} key={id}/>
                )
            })}
    </div>
  )
}
