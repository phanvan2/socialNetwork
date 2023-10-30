import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { getUser } from '../../api/UserRequest';
import defaultProfile from '../../img/default.png'
import './ChatBox.css'
import { format } from 'timeago.js'
import InputEmoji from 'react-input-emoji'

const ChatBox = ({ chat, setSendMessage, currentUser, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("123");
  const scroll = useRef()

  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);

    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUser])

  // Receive Message from parent component
  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      setMessages([...messages, receivedMessage]);
    }

  }, [receivedMessage])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        axios.get('/message/' + chat._id)
          .then(function (response) {
            setMessages(response.data);
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })

      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat])

  const handleOnChange = (newMsg) => {
    setNewMessage(newMsg)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    }
    const receiverId = chat.members.find((id) => id !== currentUser);
    // send message to socket server
    setSendMessage({ ...message, receiverId })
    // send message to database
    try {
      axios.post('/message/', message)
        .then(function (response) {
          setMessages([...messages, response.data]);
          setNewMessage("");
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })

    }
    catch
    {
      console.log("error")
    }
  }

  useEffect(()=>{
    scroll?.current?.scrollIntoView({behavior : "smooth"})
  },[messages])
  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            <div className='chat-header'>
              <div className='follower'>
                <div>
                  {/* <div className="online-dot"></div> */}
                  <img src={userData?.profilePicture ? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture :
                    defaultProfile} alt=""
                    className='followerImage'
                    style={{ width: "50px", height: "50px" }} />
                  <div className='name' style={{ fontSize: "0.8rem" }}>
                    <span>{userData?.firstname} {userData?.lastname}</span>
                    {/* <span>Online</span> */}
                  </div>
                </div>
              </div>
              <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
            </div>
            <div className="chat-body">
              {messages.map((message) => (
                <>
                  <div 
                  ref={scroll}
                  className={message.senderId === currentUser ? "message own" : "message"}>
                    <span>{message.text}</span>
                    <span>{format(message.createdAt)}</span>
                  </div>
                </>
              ))}
            </div>

            <div className='chat-sender'>
              <div>+</div>
              <InputEmoji
                value={newMessage}
                onChange={handleOnChange}
              />
              <div className="send-button button" onClick={handleSend}>
                Send
              </div>
            </div>
          </>
        ) : <span className='chatbox-empty-message'>choose chat</span>}
      </div>
    </>
  )
}

export default ChatBox
