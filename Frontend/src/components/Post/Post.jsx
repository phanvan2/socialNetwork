import React, { useState } from "react";
import "./Post.css";
import { useDispatch } from "react-redux";
import { UilMessage } from "@iconscout/react-unicons";
import { useNavigate } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import parse from "html-react-parser";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Tooltip from "@mui/material/Tooltip";

import { Modal, useMantineTheme } from "@mantine/core";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import swal from "sweetalert";

import CommentImg from "../../img/comment.png";
import Share from "../../img/share.png";
import Like from "../../img/like.png";
import NotLike from "../../img/notlike.png";

import { userInfoStore } from "../../store";
import {
    convertTimestampToHumanTime,
    convertTimestampToDateTime,
} from "../../helpers/helper";
import {
    addLike,
    removeLike,
    getLikesbyPost,
    getInforLike,
} from "../../api/LikeRequest";
import * as CommentAPI from "../../api/CommentRequest";
import { updatePost, removePost } from "../../api/PostRequest";
import Comment from "../../components/Comment/Comment";
import { alertt_success } from "../../actions/AlertAction";
import { backDropOn, backDropOFF } from "../../actions/backDropAction";

export const Post = ({ data, location = null }) => {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const [hideInputCmt, setHideInputCmt] = useState(false);
    const user = JSON.parse(localStorage.getItem("profile"));
    const theme = useMantineTheme();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [scroll, setScroll] = React.useState("paper");

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openImage, setOpenImage] = React.useState(false);

    const [liked, setLiked] = useState(0);
    const [likes, setLikes] = useState(0);
    const [contentCmt, setContentCmt] = useState();
    const [listCmt, setListCmt] = useState([]);

    // edit post
    const [title_, setTitle_] = useState(data.title);
    const [desc_, setDesc_] = useState(data.desc);
    const [file_, setFile_] = useState(null);

    const handleLiked = (e) => {
        if (liked === 0) {
            addLike(user.token, data._id);
            setLikes((prev) => prev + 1);
            setLiked(1);
        } else {
            removeLike(user.token, data._id);
            setLikes((prev) => prev - 1);
            setLiked(0);
        }
        return;
    };

    const handleChangeInputCmt = (e) => {
        setContentCmt(e.target.value);
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        let formdata = new FormData();
        formdata.append("user_token", user.token);
        formdata.append("title", title_);
        formdata.append("desc", desc_);
        formdata.append("_id", data._id);

        if (file_ !== null) {
            formdata.append("post_image", file_);
        }

        let result = await updatePost(formdata);
        console.log(result);
        data.title = title_;
        data.desc = desc_;
        data.image = result.data;
        handleCloseDiaLog();
        dispatch(alertt_success("Update post success"));

        return;
    };

    const handleDeletePost = () => {
        swal({
            title: "Do you want to delete this post?",
            icon: "warning",

            buttons: true,
            dangerMode: true,
        }).then(async (btnAction) => {
            if (btnAction) {
                const result = await removePost(user.token, data._id); //id of userr contact
                if (result.data) {
                    dispatch(
                        alertt_success(
                            "You have just successfully deleted this post"
                        )
                    );
                    navigate("/home");
                }
            } else {
                dispatch(alertt_success("ngud"));
            }
        });
    };

    const handleDeleteComment = (currentUser, data) => {
        handleClose();
        swal({
            title: "Do you want to delete this post?",
            icon: "warning",

            buttons: true,
            dangerMode: true,
        }).then(async (btnAction) => {
            if (btnAction) {
                dispatch(backDropOn());

                const result = await CommentAPI.removeComment(
                    currentUser.token,
                    data._id
                ); //id of userr contact
                console.log(result);
                if (result.data) {
                    let listcommentTempt = listCmt.filter((value) => {
                        if (value._id === data._id) {
                            return false;
                        } else {
                            return true;
                        }
                    });
                    setListCmt(listcommentTempt);

                    dispatch(backDropOFF());

                    dispatch(
                        alertt_success(
                            "You have just successfully deleted this comment"
                        )
                    );
                } else {
                    dispatch(backDropOFF());
                }
            } else {
                dispatch(backDropOFF());
            }
        });
    };
    const handleSubmitCmt = async () => {
        const newComment = {
            user_token: user.token,
            postId: data._id,
            content: contentCmt,
            avatar: user.data.avatar,
            creatAt: Date.now(),
            firstName: user.data.firstName,
            lastName: user.data.lastName,
            userId: user.data.userId,
        };

        let result = await CommentAPI.addComment(newComment);
        if (result) {
            setListCmt([newComment, ...listCmt]);
            setContentCmt("");
        } else {
            swal({
                title: "Sorry Try again later, Please",
                icon: "error",
                button: "OK!",
            });
        }
        return;
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCloseDiaLog = () => {
        setOpenDialog(false);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const sendToPost = (postId) => {
        if (location !== "postDetail") {
            let path = `/post/${postId}`;
            navigate(path);
        }
    };

    const sendToProfile = (userId) => {
        if (location === "postDetail") {
            let path = `/profile/${userId}`;
            navigate(path);
        }
    };

    let handleGetComment = async (idPost) => {
        let result = await CommentAPI.getCommentsByIdPost(idPost);
        setListCmt(result.data);
    };
    let handleGetQuanityLikes = async (idPost) => {
        let tokenUser = null;
        try {
            tokenUser = user.token;
        } catch (error) {}
        let result = await getInforLike(idPost, tokenUser);

        if (result) {
            console.log(result);
            setLiked(result.data.checkLike);
            setLikes(result.data.quanityLike);
        }
    };
    React.useEffect(() => {
        handleGetComment(data._id);
        handleGetQuanityLikes(data._id);
    }, [data._id]);

    return (
        <div
            className="Post"
            onClick={() => {
                if (user.data._id !== data.userId || location !== "profile")
                    sendToPost(data._id);
            }}
        >
            <div className="card-post-header">
                <div className="post-header">
                    <div
                        className="detail-post-header"
                        onClick={() => sendToPost(data._id)}
                    >
                        <div className="div-image-avatar">
                            <img
                                src={`${process.env.REACT_APP_AVATAR_IMAGE_FOLDER}${data.avatar}`}
                                alt=""
                                className="image-post-header"
                            />
                        </div>
                        <div
                            className="div-info-user"
                            onClick={() => sendToProfile(data.userId)}
                        >
                            <span className="desc-post">{data.firstName}</span>
                            <Tooltip
                                title={convertTimestampToDateTime(data.creatAt)}
                            >
                                <span className="createTime-post">
                                    {convertTimestampToHumanTime(
                                        `${data.creatAt}`
                                    )}
                                </span>
                            </Tooltip>
                        </div>
                    </div>
                    <div>
                        {user.data._id === data.userId &&
                        location == "profile" ? (
                            <>
                                <MoreHorizIcon
                                    onClick={handleClick}
                                ></MoreHorizIcon>
                                <Popover
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                    transformOrigin={{
                                        horizontal: "center",
                                    }}
                                >
                                    <Typography
                                        className="btn-edipost"
                                        sx={{ p: 2 }}
                                        onClick={() => {
                                            setOpenDialog(true);
                                            handleClose();
                                        }}
                                    >
                                        Edit Post.
                                    </Typography>
                                    <Typography
                                        className="btn-edipost"
                                        sx={{ p: 2 }}
                                        onClick={() => {
                                            handleDeletePost();
                                        }}
                                    >
                                        Delete Post.
                                    </Typography>
                                </Popover>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
            <span>{data.title}</span>
            <span style={{ fontSize: "14px", color: "#575454" }}>
                {parse(data.desc)}
            </span>

            <img
                src={
                    data.image
                        ? `${process.env.REACT_APP_POSTS_IMAGE_FOLDER}` +
                          data.image
                        : ""
                }
                alt=""
                onClick={() => {
                    setOpenImage(true);
                }}
            />

            <div className="postReact" onClick={() => sendToPost(data._id)}>
                <div>
                    <img
                        src={liked == 1 ? Like : NotLike}
                        alt=""
                        style={{ cursor: "pointer" }}
                        onClick={handleLiked}
                    />
                    <p
                        style={{
                            color: "var(--gray)",
                            fontSize: "12px",
                            textAlign: "center",
                            margin: "2px",
                        }}
                    >
                        {likes}
                    </p>
                </div>
                <div>
                    <img
                        src={CommentImg}
                        alt=""
                        onClick={() => setHideInputCmt((prev) => !prev)}
                    />
                    <p
                        style={{
                            fontSize: "12px",
                            color: "var(--gray)",
                            textAlign: "center",
                            margin: "2px",
                        }}
                    >
                        {listCmt.length}
                    </p>
                </div>
                <div>
                    <img src={Share} alt="" />
                </div>
            </div>

            {hideInputCmt && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "3px",
                        gap: "10px",
                    }}
                >
                    <img
                        src={`${process.env.REACT_APP_AVATAR_IMAGE_FOLDER}${user.data.avatar}`}
                        alt=""
                        className="img-input-comment"
                    />

                    <input
                        type="text"
                        placeholder="Comment"
                        onChange={handleChangeInputCmt}
                        value={contentCmt}
                    />
                    <UilMessage onClick={handleSubmitCmt} />
                </div>
            )}

            {location === "postDetail" ? (
                listCmt.map((cmt, id) => {
                    return (
                        <div style={{ display: "contents" }}>
                            <Comment
                                key={id}
                                data={cmt}
                                handleDeleteComment={handleDeleteComment}
                            />
                        </div>
                    );
                })
            ) : (
                <></>
            )}

            <Modal
                overlayColor={
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[9]
                        : theme.colors.gray[2]
                }
                overlayOpacity={0.55}
                overlayBlur={3}
                size="55%"
                opened={openDialog}
                onClose={() => handleCloseDiaLog()}
            >
                {/* Modal content */}
                <form className="infoForm" action="">
                    <h3>Edit post</h3>
                    <div>
                        <input
                            style={{ width: "80%" }}
                            type="text"
                            className="infoInput"
                            name="Title"
                            placeholder="Title"
                            defaultValue={title_}
                            onChange={(e) => {
                                setTitle_(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <CKEditor
                            style={{ height: "100px" }}
                            editor={ClassicEditor}
                            data={desc_}
                            onReady={(editor) => {
                                // You can store the "editor" and use when it is needed.
                                console.log("Editor is ready to use!", editor);
                            }}
                            onChange={(event, editor) => {
                                setDesc_(editor.getData());
                            }}
                        />
                    </div>
                    <div style={{ marginTop: "105px" }}>
                        Profile Image
                        <input
                            type="file"
                            name="profilePicture"
                            onChange={(e) => {
                                setFile_(e.target.files[0]);
                            }}
                        />
                    </div>
                    <button
                        className="button infoButton"
                        onClick={handleUpdatePost}
                    >
                        Update
                    </button>
                </form>
            </Modal>

            <Dialog
                open={openImage}
                onClose={() => setOpenImage(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent style={{ padding: "0px" }}>
                    <img
                        src={
                            data.image
                                ? `${process.env.REACT_APP_POSTS_IMAGE_FOLDER}` +
                                  data.image
                                : ""
                        }
                        style={{ width: "100%" }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};
