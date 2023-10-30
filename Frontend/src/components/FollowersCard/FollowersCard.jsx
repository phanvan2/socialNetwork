import React, { useEffect, useState } from 'react'
import './FollowersCard.css'
import { User } from '../User/User'
import axios from "axios"
import { useSelector } from 'react-redux'

export const FollowersCard = () => {
  const [persons , setPersons] = useState([])
  const user  = useSelector((state) => state.authReducer.authData)

  


  useEffect(()=>{
    axios.get(process.env.REACT_APP_API_URL + `/user/${user._id}/allUser`)
    .then(res => {
      setPersons(res.data)
    })
    .catch(error => console.log(error));
  },[])
  return (
    <div className='FollowersCard'>
        <h3>You may know</h3>

        {persons.map((person , id) => {
            return (
                    <User person={person} key={id}/>
                )
            })}
    </div>
  )
}
