import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import swal from "sweetalert";

import "./Posts.css";
import { userInfoStore, postsProfile } from "../../store";
import { Post } from "../Post/Post";
import { backDropOn, backDropOFF } from "../../actions/backDropAction";
import { updatePost, removePost } from "../../api/PostRequest";
import { alertt_success } from "../../actions/AlertAction";

const Posts = ({ location }) => {
    const posts = userInfoStore((state) => state.posts);
    const postsProfile1 = postsProfile((state) => state.postsProfile);
    const setPostsProfile = postsProfile((state) => state.setPostsProfile);
    const dispatch = useDispatch();

    const handleDeletePost = (user_token, idPost, handleClose) => {
        handleClose();
        swal({
            title: "Do you want to delete this post?",
            icon: "warning",

            buttons: true,
            dangerMode: true,
        }).then((btnAction) => {
            if (btnAction) {
                dispatch(backDropOn());
                setTimeout(async () => {
                    const result = await removePost(user_token, idPost); //id of userr contact
                    if (result.data) {
                        let postProfi = postsProfile1.filter((value) => {
                            if (value._id === idPost) {
                                return false;
                            } else {
                                return true;
                            }
                        });
                        setPostsProfile(postProfi);
                        dispatch(backDropOFF());

                        dispatch(
                            alertt_success(
                                "You have just successfully deleted post"
                            )
                        );
                    } else {
                        dispatch(backDropOFF());
                    }
                }, 1000);
            } else {
            }
        });
    };
    return (
        <div className="Posts">
            {location === "homePage"
                ? posts.map((post, id) => {
                      return (
                          <Post
                              data={post}
                              id={id}
                              location={"homePage"}
                              handleDeletePost={handleDeletePost}
                          />
                      );
                  })
                : postsProfile1.map((post, id) => {
                      return (
                          <Post
                              data={post}
                              id={id}
                              location={"profile"}
                              handleDeletePost={handleDeletePost}
                          />
                      );
                  })}
        </div>
    );
};

export default Posts;
