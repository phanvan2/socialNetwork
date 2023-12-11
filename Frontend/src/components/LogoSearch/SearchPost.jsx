import React from 'react'
import {UilSearch} from '@iconscout/react-unicons';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'



import './LogoSearch.css'

import * as PostAPI from "../../api/PostRequest" ; 
import { convertTimestampToHumanTime } from '../../helpers/helper';

const SearchPost = () => {

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const  userToken  = useSelector(state => state.authReducer.authData).token; 
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');
  const [txtSearch, setTxtSearch] = React.useState("");

  const [posts, setPosts] = React.useState([]);


  const handleClickOpen = () => {
    setOpen(true);
    setScroll("paper");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = async() => {
    console.log(userToken);
    console.log(txtSearch) ; 
    let result = await PostAPI.searchPost(userToken, txtSearch);
    console.log(result)
    setPosts(result.data); 
  }

  const setValueInputSearch = (e) => {
    
    setTxtSearch(e.target.value) ;

  }

  const descriptionElementRef = React.useRef(null);


  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const sendToPost = (postId) => {
    let path = `/post/${postId}`;
    navigate(path);
    handleClose();
  }
  return (
    <>
      <div className='LogoSearch' onClick={handleClickOpen}>
        {/* <img width={50} height={50} src={Logo} alt='' /> */}
        <div className='search' >
          <input type="text" placeholder='#Search Posts'  onClick={handleClickOpen} />
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
            
            <input type="text" placeholder='#Search Posts' className='input-search1' defaultValue={txtSearch} onChange={setValueInputSearch}/>
            <div className='s-icon' onClick={()=> handleSearch()}>
                <UilSearch />
              </div>
          </div>
        </DialogTitle>
        <DialogContent dividers={scroll === 'paper'} style={{height:"500px"}}>
        <div className='FollowersCard'>
          {posts.map((post, index) => (
            <div className='card-post-search' key={index}>
              <div className='post-search'>
                <img src={`${process.env.REACT_APP_POSTS_IMAGE_FOLDER}${post.image}`} alt="" className='image-post-search' />
                <div className='detail-post-search'>
                  <span className='desc-post'>{post.desc}</span><br/>
                  <span className='createTime-post'>{convertTimestampToHumanTime(`${post.creatAt}`)}</span>
                </div>
                <div className='btn-view-post-search'>
                  <Button variant="outlined"  onClick={()=> sendToPost(post._id) }>View</Button>
                </div>
  
              </div>
            
            </div>  
          ))}
  
        </div>

        </DialogContent>
        
      </Dialog>
    </>
    
  )
}

export default SearchPost; 


