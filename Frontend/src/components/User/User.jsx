import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";

import "./User.css";
import ProfileImage from "../../img/default.png";

export const User = ({
    person,
    disableClick = false,
    turnOffOnline = false,
}) => {
    const publicFolder = process.env.REACT_APP_AVATAR_IMAGE_FOLDER;

    let navigate = useNavigate();
    const sendToProfile = () => {
        if (!disableClick) {
            let path = `/profile/${person._id}`;
            navigate(path);
        }
    };

    return (
        <div>
            <div className="follower" style={{ cursor: "pointer" }}>
                <div onClick={sendToProfile}>
                    <img
                        src={
                            person.avatar
                                ? process.env.REACT_APP_AVATAR_IMAGE_FOLDER +
                                  person.avatar
                                : ProfileImage
                        }
                        alt=""
                        className="followerImg"
                    />

                    <div className="name">
                        <span>{person.firstName + " " + person.lastName}</span>
                        {!turnOffOnline ? (
                            <span
                                className="status-user user-offline"
                                id={`user${person._id}`}
                            >
                                offline
                            </span>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
