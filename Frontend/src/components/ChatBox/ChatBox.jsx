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
                  <img  src="http://localhost:5000/images/users/1702345261633-68eafff2-4c9b-4ce5-82ab-6bd379a686a6-IMG_3896.jpg" alt=""
                    className='followerImg'
                    style={{ width: "50px", height: "50px" }} />
                  <div className='name' style={{ fontSize: "0.8rem" }}>
                    <span>Phan van</span>
                    {/* <span>Online</span> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="chat-body">
                <div 
                              ref={scroll}
                      className={"message own"}>
                        <span>Hello</span>
                        {/* <span>a day ago</span> */}
                      </div>
                      <div 
                      ref={scroll}
                      className={"message"}>
                        <span>OK you</span>
                        {/* <span>a day ago</span> */}
                      </div>
                      <div 
                      ref={scroll}
                      className={"message own"}>
                        <span>Can You help me? </span>
                        {/* <span>a day ago</span> */}
                      </div>
                      <div 
                      ref={scroll}
                      className={"message"}>
                        <span>No </span>
                        {/* <span>a day ago</span> */}
                      </div>
                      <div 
                      ref={scroll}
                      className={"message own"}>
                        <span>What school do you attend</span>
                        {/* <span>a day ago</span> */}
                      </div>
                      <div 
                      ref={scroll}
                      className={"message"}>
                        <span>I study at Vietnam-Korean University of Information Technology and Communications</span>
                        {/* <span>a day ago</span> */}
                      </div>
                      <div 
                      ref={scroll}
                      className={"message own"}>
                        <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore quam atque suscipit harum esse, saepe, exercitationem vel, ad laborum eum nesciunt veniam? In sint reiciendis quis molestiae ipsam hic beatae.</span>

                        {/* <span>a day ago</span> */}
                      </div>
                      <div 
                      ref={scroll}
                      className={"message"}>
                        <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore quam atque suscipit harum esse, saepe, exercitationem vel, ad laborum eum nesciunt veniam? In sint reiciendis quis molestiae ipsam hic beatae.</span>
                        {/* <span>a day ago</span> */}
                      </div>

              {messages
              .map((message) => (
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
