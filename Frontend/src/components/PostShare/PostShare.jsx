import React, {useState , useRef} from 'react'
import './PostShare.css'
import ProfileImage from '../../img/default.png'
import { UilScenery } from "@iconscout/react-unicons"
import { UilPlayCircle } from "@iconscout/react-unicons"
import { UilLocationPoint } from "@iconscout/react-unicons"
import { UilSchedule } from "@iconscout/react-unicons"
import { UilTimes } from "@iconscout/react-unicons"
import { useDispatch, useSelector } from 'react-redux'
import { uploadImage , uploadPost } from '../../actions/UploadAction'
import axios from 'axios'
import userInfoStore from '../../store'

const PostShare = (props) => {
    // const loading = false
    const loading = useSelector((state) => state.postReducer.loading)
    const [image , setImage] = useState(null)
    const user = useSelector((state) => state.authReducer.authData)
    const desc = useRef()

    const addPosts = userInfoStore((state) => state.addPosts)

    const imageRef = useRef()
    const dispatch = useDispatch()
    const onChangeImage = (event)=>{
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0]
            setImage(img)
        }
    }


    const reset = () =>{
        setImage(null)
        desc.current.value = ""
    }

    const handleSubmit = (e)=>{
        e.preventDefault();

        const newPost = {
            userId : user._id,
            desc : desc.current.value
        }

        if (image) {
            const data = new FormData()
            const filename = Date.now() + image.name

            data.append('name' , filename)
            data.append('file' , image)

            newPost.image = filename
            try {
                dispatch(uploadImage(data))
            } catch (error) {
                console.log(error);
            }
        }
        axios.post(process.env.REACT_APP_API_URL + `/post`,newPost)
            .then(res => {
                addPosts(res.data)
            })
        .catch(error => console.log(error));
        
        reset()
    }
    const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER
    
    return (
        <div className='PostShare'>
            {/* <img src={user.coverPicture ? publicFolder + user.coverPicture : ProfileImage} alt="" /> */}
            <div>
                <input
                ref={desc}
                required
                type="text" placeholder='What is happening' />
                <div className="postOptions">
                    <div className="option" style={{color: "var(--photo)"}}
                    onClick={()=>imageRef.current.click()}
                    >
                        <UilScenery /> Photo
                    </div>
                    <div className="option" style={{color: "var(--video)"}}>
                        <UilPlayCircle /> Video
                    </div>
                    <div className="option" style={{color: "var(--location)"}}>
                        <UilLocationPoint /> Location
                    </div>
                    <div className="option" style={{color: "var(--shedule)"}}>
                        <UilSchedule /> Shedule
                    </div>
                    <button className='button ps-button'
                    onClick={handleSubmit}
                    disabled={loading}
                    >
                        {loading ? "Loading" : "Share"}
                    </button>
                    <div style={{display:"none"}}>
                        <input type="file" accept='image/*' name='myFile' ref={imageRef} onChange={onChangeImage}/>
                    </div>
                </div>
                {image && (
                    <div className='previewImage'>
                        <UilTimes onClick={()=> setImage(null)}/>
                        <img src={URL.createObjectURL(image)} alt="" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostShare
