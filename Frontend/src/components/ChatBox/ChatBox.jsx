import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import "./ChatBox.css";
import InputEmoji from "react-input-emoji";

import { getListChatbyIdUser, sendChat } from "../../api/ChatRequest";
import { socketStore, listChatStore, friendsOnlineStore } from "../../store";
import { User } from "../User/User";

const ChatBox = ({ chat, setSendMessage, currentUser, receivedMessage }) => {
  // const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("123");

  const setListChat = listChatStore((state) => state.setListChat);
  const listChat = listChatStore((state) => state.listChat);
  const addListChat = listChatStore((state) => state.addListChat);

  const friendsOnline = friendsOnlineStore((state) => state.friendsOnline);

  const socket_ = socketStore((state) => state.socket);

  const scroll = useRef();

  useEffect(() => {
    if (chat && currentUser) {
      getListChatbyIdUser(currentUser.token, chat._id).then((response) => {
        setListChat(response.data);
      });
    }
  }, [chat]);

  React.useEffect(() => {
    const x = document.querySelectorAll(`span.status-user`);
    x.forEach((value) => {
      console.log(chat);
      value.classList.remove("user-online");
      value.classList.add("user-offine");
      value.innerHTML = "offline";

      friendsOnline.forEach((userId) => {
        if (value.id == `user${userId}`) {
          value.classList.remove("user-offline");
          value.classList.add("user-online");
          value.innerHTML = "online";
        }
      });
    });
  }, [friendsOnline]);

  const handleOnChange = (newMsg) => {
    setNewMessage(newMsg);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    let dataChat = {
      receiverId: chat._id,
      text: newMessage,
      messageType: "text",
    };

    socket_.emit("chat-text", { dataChat: dataChat });
    try {
      sendChat(currentUser.token, chat._id, {
        text: newMessage,
        messageType: "text",
      }).then((response) => {
        if (response.data) {
          addListChat({
            senderId: currentUser.data._id,
            receiverId: chat._id,
            messageType: "text",
            text: newMessage,
          });
          setNewMessage("");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  let getMessgeFromSocket = () => {
    if (socket_)
      socket_.on("response-chat-text", (newMessage) => {
        if (newMessage.receiverId === currentUser.data._id) {
          addListChat(newMessage);
        }
      });
  };
  useEffect(() => {
    getMessgeFromSocket();
  }, [socket_]);

  useEffect(() => {
    scroll?.current?.scrollIntoView({ behavior: "smooth" });
  }, [listChat]);
  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            <div className="chat-header">
              <User person={chat} key={chat._id} turnOffOnline="true"></User>
              {/* <div className="follower">
                <div>
                  <img
                    src={`${process.env.REACT_APP_AVATAR_IMAGE_FOLDER}${chat.avatar}`}
                    alt=""
                    className="followerImg"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="name" style={{ fontSize: "0.8rem" }}>
                    <span>{chat.firstName}</span>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="chat-body">
              {listChat.map((message) => (
                <>
                  <div
                    ref={scroll}
                    className={
                      message.senderId === currentUser.data._id
                        ? "message own"
                        : "message"
                    }
                  >
                    <span>{message.text}</span>
                  </div>
                </>
              ))}
            </div>

            <div className="chat-sender">
              <div>+</div>
              <InputEmoji value={newMessage} onChange={handleOnChange} />
              <div className="send-button button" onClick={handleSend}>
                Send
              </div>
            </div>
          </>
        ) : (
          <span className="chatbox-empty-message">choose chat</span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
