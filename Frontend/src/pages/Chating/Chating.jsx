import React, { useEffect, useRef, useState } from 'react'
import './Chating.css'
import LogoSearch from "../../components/LogoSearch/LogoSearch"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Coversation from '../../components/Coversation/Coversation'
import { Link, useParams } from 'react-router-dom'
import { UilMessage } from '@iconscout/react-unicons'
import { UilSetting } from '@iconscout/react-unicons'
import { UilSignout } from '@iconscout/react-unicons'
import Home from '../../img/home.png'
import { logOut } from '../../actions/AuthAction'
import ChatBox from '../../components/ChatBox/ChatBox'
import { io } from 'socket.io-client'

const Chating = () => {
  const user  =  JSON.parse(localStorage.getItem("profile"))

  const [chats, setChats] = useState([])
  const dispatch = useDispatch()
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const socket = useRef()
  const { id } = useParams()


  useEffect(() => {
    // socket.current = io("https://socketio-chating.onrender.com");
    // socket.current.emit("new-user-add", user._id);
    // socket.current.on("get-users", (users) => {
    //   setOnlineUsers(users);
    // });
  }, [user])


  // Send Message to socket server
  useEffect(() => {
    // if (sendMessage !== null) {
    //   socket.current.emit("send-message", sendMessage);
    // }
  }, [sendMessage]);


  useEffect(() => {
    chats.map((chat) => {
      if (chat.members.includes(id)) {
        setCurrentChat(chat)
        console.log(chat);
      }
    })
  }, [id])

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/contact/get-list-friends?user_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTJlNTFiMzZhNzY1NGE5ZTRiODM4MjUiLCJmaXJzdE5hbWUiOiJwaHVuZzEiLCJsYXN0TmFtZSI6IlBoYW4gdmlwMSIsImVtYWlsIjoicHZwaHVuZy4xOWl0MUB2a3UudWRuLnZuIiwiYXZhdGFyIjoiMTcwMjM0NzkzMjA0MC02ODEyZTEwMC0xZGU1LTQzMGYtYWQ5Yi0yODY2OTljNTYyMmYtcG9zdHBpYzIuanBnIiwiaXNBY3RpdmUiOnRydWUsImdlbmRlciI6Im1hbGUiLCJsaXZlc2luIjoiRG9uZyBob2kiLCJjb3VudHJ5IjoiVmlldCBOYW0iLCJ3b3JrQXQiOiJTdHVkZW50IiwicmVsYXRpb25zaGlwIjoiU2luZ2xlIiwiaWF0IjoxNzA0MTI0MjcxLCJleHAiOjE3MDQxNDIyNzF9.52YVb1hOVzbOcurRgi9n0QgxuLM89lIH-4QSTFdD0lI')
      .then(function (response) {
        console.log(response.data) ; 
        setChats(response.data)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }, [id])
  const handleLogOut = () => {
    if (window.confirm("You want to logout?")) {
      dispatch(logOut())
    }
  }
  // Get the message from socket server
  useEffect(() => {
    // socket.current.on("recieve-message", (data) => {
    //   setReceivedMessage(data);
    // }

    // );
  }, []);
  return (
    <div className='Chat'>
      <div className='Left-side-chat'>
        <LogoSearch />
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div onClick={() => { setCurrentChat(chat); }}>
                <Coversation
                  data={chat}
                  currentUser={user.data._id}
                // online={checkOnlineStatus(chat)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='Right-side-chat'>
        <div style={{ width: '20rem', alignSelf: 'flex-end' }}>
          <div className="navIcons">
            <Link style={{ width: "1.5rem", height: "1.5rem" }} to="/home">
              <img style={{ width: "100%", height: "100%" }} src={Home} alt="" />
            </Link>
            <UilSetting style={{ cursor: "pointer" }} />
            <Link to="/chat">
              <UilMessage style={{ cursor: "pointer" }} />
            </Link>
            <UilSignout style={{ cursor: "pointer" }} onClick={handleLogOut} />
          </div>

        </div>
        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  )
}

export default Chating
