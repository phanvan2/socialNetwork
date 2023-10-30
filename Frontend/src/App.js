import "./App.css"
import { Auth } from "./pages/Auth/Auth";
import { Home } from "./pages/home/Home";
import { Profile } from "./pages/Profile/Profile";
import {alertt_off} from "./actions/AlertAction" ;

import {Routes , Route , Navigate} from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import Chating from "./pages/Chating/Chating";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import React, { useState } from 'react';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function App() {
  const user = useSelector((state) => state.authReducer.authData)
  const open = useSelector((state) => state.alertReducer.open)
  const dispatch = useDispatch();

  console.log(open);

  return (
    <div className="App">
        <div className="blur" style={{ top: "-18%" , right: "0" }}></div>
        <div className="blur" style={{ top: "36%" , left: "-8rem" }}></div>
        <Routes>
          <Route path="/" element={user ? <Navigate to = "home" /> : <Navigate to="auth" />}/>
          <Route path="/home" element = {user ? <Home/> : <Navigate to="../auth"/>}/>
          <Route path="/auth" element = {user ? <Navigate to="../home"/> : <Auth/>}/>
          <Route path="/profile/:id" element={user ? <Profile/> : <Navigate to="../auth"/>} />
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
                    This is a success message!
                </Alert>
            </Snackbar>
    </div>
  );
}

export default App;
