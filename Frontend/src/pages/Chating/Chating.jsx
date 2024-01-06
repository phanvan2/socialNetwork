import React, { useEffect, useRef, useState } from "react";
import "./Chating.css";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Coversation from "../../components/Coversation/Coversation";
import { Link, useParams } from "react-router-dom";
import { UilMessage } from "@iconscout/react-unicons";
import { UilSetting } from "@iconscout/react-unicons";
import { UilSignout } from "@iconscout/react-unicons";
import Home from "../../img/home.png";
import { logOut } from "../../actions/AuthAction";
import ChatBox from "../../components/ChatBox/ChatBox";
import { socketStore } from "../../store";

import { getListFriend } from "../../api/contactRequest";

const Chating = () => {
  const user = JSON.parse(localStorage.getItem("profile"));

  const [chats, setChats] = useState([]);
  const dispatch = useDispatch();
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const socket_ = socketStore((state) => state.socket);
  const { id } = useParams();

  useEffect(() => {
    getListFriend(user.token).then(function (response) {
      setChats(response.data);
    });
  }, [id]);
  const handleLogOut = () => {
    if (window.confirm("You want to logout?")) {
      dispatch(logOut());
    }
  };
  // Get the message from socket server

  return (
    <div className="Chat">
      <div className="Left-side-chat">
        <LogoSearch />
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div
                onClick={() => {
                  setCurrentChat(chat);
                }}
              >
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
      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <div className="navIcons">
            <Link style={{ width: "1.5rem", height: "1.5rem" }} to="/home">
              <img
                style={{ width: "100%", height: "100%" }}
                src={Home}
                alt=""
              />
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
          currentUser={user}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default Chating;
