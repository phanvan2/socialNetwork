import React from 'react'
import {UilSearch} from '@iconscout/react-unicons';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux'


import './LogoSearch.css'
import Logo from '../../img/logo.png';
import UserSearch from "../../components/User/UserSearch" ; 
import { findContact } from '../../actions/ContactAction';

const LogoSearch = () => {

  const dispatch = useDispatch();

  const  userToken  = useSelector(state => state.authReducer.authData).token; 
  let contactFind = useSelector((state) => state.contactFind.contactfind);
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');
  const [txtSearch, setTxtSearch] = React.useState("");


  const handleClickOpen = () => {
    console.log("oke bro")
    setOpen(true);
    setScroll("paper");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = () => {
    dispatch(findContact(txtSearch, userToken))
  }

  const setValueInputSearch = (e) => {
    
    setTxtSearch(e.target.value) ;

  }

  const descriptionElementRef = React.useRef(null);

  React.useEffect(()=> {
    dispatch(findContact(txtSearch, userToken))
  }, [txtSearch])

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  return (
    <>
      <div className='LogoSearch'>
        {/* <img width={50} height={50} src={Logo} alt='' /> */}
        <div className='search' onClick={handleClickOpen}>
          <input type="text" placeholder='#Explore' disabled/>
          <div className='s-icon'>
            <UilSearch />
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        fullWidth={true}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <div className='search' >
            
            <input type="text" placeholder='#Explore' className='input-search1' defaultValue={txtSearch} onChange={setValueInputSearch}/>
            <div className='s-icon' onClick={handleSearch}>
                <UilSearch />
              </div>
          </div>
        </DialogTitle>
        <DialogContent dividers={scroll === 'paper'} style={{height:"500px"}}>
        <div className='FollowersCard'>

          { contactFind ? contactFind.data ?contactFind.data.map((contactUser)=> (
            <>
              <UserSearch key={contactUser._id} contactUser={contactUser}></UserSearch>
            </>

          )): 
            (<>
            Không tìm thấy kết quả
            </>):
             (<>
              Không tìm thấy kết quả
              </>)
          }

        </div>
          {/* <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            height={"400px"}
          >
            tìmkiếm gì tìm keiém dê  
          </DialogContentText> */}
        </DialogContent>
        
      </Dialog>
    </>
    
  )
}

export default LogoSearch
