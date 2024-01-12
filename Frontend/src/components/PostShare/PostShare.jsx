import React, { useState, useRef } from "react";
import "./PostShare.css";
import ProfileImage from "../../img/default.png";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";

import { uploadImage, uploadPost } from "../../actions/UploadAction";
import { addNewPost } from "../../api/PostRequest";

import { userInfoStore } from "../../store";
import { backDropOn, backDropOFF } from "../../actions/backDropAction";

const PostShare = (props) => {
    // const loading = false
    const loading = useSelector((state) => state.postReducer.loading);
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);

    const user = JSON.parse(localStorage.getItem("profile"));

    const title = useRef();

    const addPosts = userInfoStore((state) => state.addPosts);

    const imageRef = useRef();
    const videoRef = useRef();

    const dispatch = useDispatch();
    const onChangeImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setVideo(null);

            setImage(img);
        }
    };
    const onChangeVideo = (event) => {
        if (event.target.files && event.target.files[0]) {
            let video = event.target.files[0];
            setVideo(null);

            setImage(null);

            setVideo(video);
        }
    };

    const reset = () => {
        setImage(null);
        title.current.value = "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(backDropOn());
        setTimeout(() => {
            const formData = new FormData();
            formData.append("user_token", user.token);
            formData.append("title", title.current.value);
            formData.append("post_image", image);

            addNewPost(formData).then((res) => {
                dispatch(backDropOFF());
            });
            reset();
        }, 1000);
    };
    const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
        <div className="PostShare">
            {/* <img src={user.coverPicture ? publicFolder + user.coverPicture : ProfileImage} alt="" /> */}
            <div>
                <input
                    ref={title}
                    required
                    type="text"
                    placeholder="What is happening"
                />
                <div className="postOptions">
                    <div
                        className="option"
                        style={{ color: "var(--photo)" }}
                        onClick={() => imageRef.current.click()}
                    >
                        <UilScenery /> Photo
                    </div>
                    <div
                        className="option"
                        style={{ color: "var(--video)" }}
                        onClick={() => videoRef.current.click()}
                    >
                        <UilPlayCircle /> Video
                    </div>
                    <div
                        className="option"
                        style={{ color: "var(--location)" }}
                    >
                        <UilLocationPoint /> Location
                    </div>
                    <div className="option" style={{ color: "var(--shedule)" }}>
                        <UilSchedule /> Shedule
                    </div>
                    <button
                        className="button ps-button"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Loading" : "Share"}
                    </button>
                    <div style={{ display: "none" }}>
                        <input
                            type="file"
                            accept="image/*"
                            name="myFile"
                            ref={imageRef}
                            onChange={onChangeImage}
                        />
                    </div>
                    <div style={{ display: "none" }}>
                        <input
                            type="file"
                            accept="video/*"
                            name="myVideo"
                            ref={videoRef}
                            onChange={onChangeVideo}
                        />
                    </div>
                </div>
                {image && (
                    <div className="previewImage">
                        <UilTimes onClick={() => setImage(null)} />
                        <img src={URL.createObjectURL(image)} alt="" />
                    </div>
                )}
                {video && (
                    <div className="previewImage">
                        <UilTimes onClick={() => setVideo(null)} />
                        <Box
                            component="ul"
                            sx={{
                                display: "flex",
                                gap: 2,
                                flexWrap: "wrap",
                                p: 0,
                                m: 0,
                            }}
                        >
                            <Card
                                component="li"
                                sx={{ minWidth: 500, flexGrow: 1 }}
                            >
                                <CardCover>
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        poster="https://assets.codepen.io/6093409/river.jpg"
                                    >
                                        <source
                                            src={URL.createObjectURL(video)}
                                            type="video/mp4"
                                        />
                                    </video>
                                </CardCover>
                                <CardContent>
                                    <Typography
                                        level="body-lg"
                                        fontWeight="lg"
                                        textColor="#fff"
                                        mt={{ xs: 12, sm: 18 }}
                                    >
                                        Video
                                    </Typography>
                                </CardContent>
                            </Card>
                            {/* <video
                            src={URL.createObjectURL(video)}
                            controls
                        ></video> */}
                        </Box>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostShare;
