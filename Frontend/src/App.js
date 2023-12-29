import "./App.css"
import { Auth } from "./pages/Auth/Auth";
import { Home } from "./pages/home/Home";
import { Profile } from "./pages/Profile/Profile";
import {PostDetail} from "./pages/PostDetail/PostDetail";
import {alertt_off} from "./actions/AlertAction" ;

import { initSocket } from "./sockets/initSocket";
import { getRequestFriend } from "./sockets/getRequestFriend";
import { approveRequestContactReceived } from "./sockets/approveRequestContactReceived";
import { userOfflineOnline } from "./sockets/userOfflineOnline";

import {socketStore, notificationStore, friendsOnlineStore, friendsStore} from "../src/store"; 
import * as API from "./api/AuthRequest"; 

import {Routes , Route , Navigate} from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import Chating from "./pages/Chating/Chating";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import React, { useState,useEffect } from 'react';
import { io } from "socket.io-client";
import { logOut } from "./actions/AuthAction";



const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function App() {
  const user = useSelector((state) => state.authReducer.authData)
  const messsNoti = useSelector((state) => state.alertReducer.message)
  const open = useSelector((state) => state.alertReducer.open)

  const openBackDrop = useSelector((state) => state.backDropReducer.open)

  
  

  const currentUser = JSON.parse(localStorage.getItem("profile"))

  const friends = friendsStore((state) => state.friends); 
  console.log(friends); 

  const dispatch = useDispatch();

  const setSocket = socketStore((state)=> state.setSocket) ; 

  const setFriendsOnline = friendsOnlineStore((state) => state.setFriendsOnline) ; 
  const addFriendOnline = friendsOnlineStore((state) => state.addFriendOnline) ; 
  const removeFriendOffline = friendsOnlineStore((state) => state.removeFriendOffline); 

  const socket = io("http://localhost:5000", {
    autoConnect: false,
    auth: {
      token: "ahihi",
    },
  });
  const check_token = async() => {
    if(currentUser){
      let check =  await API.checkExpiredToken(currentUser.token);
      if(!check.data.data){
        dispatch(logOut());
      }else{
      };
    }
  }
  useEffect(() => {
    check_token(); 
    setSocket(socket);
  }, []);


   

  initSocket(user);
  getRequestFriend(socket,  notificationStore((state)=> state.addNotification), dispatch);
  approveRequestContactReceived(socket,    notificationStore((state)=> state.addNotification), dispatch);
  userOfflineOnline(socket, setFriendsOnline, addFriendOnline , removeFriendOffline);

  return (
    <div className="App">
        <div className="blur" style={{ top: "-18%" , right: "0" }}></div>
        <div className="blur" style={{ top: "36%" , left: "-8rem" }}></div>
        <Routes>
          <Route path="/" element={user ? <Navigate to = "home" /> : <Navigate to="auth" />}/>
          <Route path="/home" element = {user ? <Home/> : <Navigate to="../auth"/>}/>
          <Route path="/auth" element = {user ? <Navigate to="../home"/> : <Auth/>}/>
          <Route path="/profile/:id" element={user ? <Profile/> : <Navigate to="../auth"/>} />
          <Route path="/post/:idPost" element={user ? <PostDetail/> : <Navigate to="../auth"/>} />
          <Route path="/chat/:id" element={user ? <Chating/> : <Navigate to="../auth"/>} />
          <Route path="/chat" element={user ? <Chating/> : <Navigate to="../auth"/>} />
        </Routes>
      
        <Snackbar open={open}  
          onClose={ (event, reason)=> 
            { 
              if (reason === 'clickaway') { 
                dispatch(alertt_off()); return; 
              }
            }} >
                <Alert
                        severity="success" sx={{ width: '100%' }}>
                    {messsNoti}
                </Alert>
            </Snackbar>
            <Backdrop
        sx={{ color: '#F99329', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default App;
