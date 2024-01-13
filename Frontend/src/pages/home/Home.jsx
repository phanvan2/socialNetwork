import React, { useEffect } from "react";
import "./Home.css";
import ProfileSide from "../../components/profileSide/ProfileSide";
import PostSide from "../../components/PostSide/PostSide";
import { RightSide } from "../../components/RightSide/RightSide";
import { userInfoStore } from "../../store";
import * as PostAPI from "../../api/PostRequest";

import axios from "axios";
import { useSelector } from "react-redux";

export const Home = () => {
    const user = JSON.parse(localStorage.getItem("profile"));

    const setPosts = userInfoStore((state) => state.setPosts);
    const setUserInfo = userInfoStore((state) => state.setUserInfo);

    let getPostsByFriend = async () => {
        try {
            let result = await PostAPI.getPostsByFriend(user.token);
            if (result.data) {
                setPosts(result.data);
            }
        } catch (error) {}
    };

    useEffect(() => {
        getPostsByFriend();

        axios
            .get(process.env.REACT_APP_API_URL + `/user/${user._id}`)
            .then((res) => {
                setUserInfo(res.data);
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <div className="Home">
            <ProfileSide location="homePage" />
            <PostSide location="homePage" />
            <RightSide />
        </div>
    );
};
