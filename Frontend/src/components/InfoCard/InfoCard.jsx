import React, { useState } from "react";
import "./InfoCard.css";
import { UilPen } from "@iconscout/react-unicons";
import ProfileModal from "../ProfileModal/ProfileModal";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userInfoStore } from "../../store";
import { FaHeart, FaCity, FaTransgender } from "react-icons/fa";
import { MdWorkOutline } from "react-icons/md";

export const InfoCard = () => {
    const [modalOpened, setModalOpened] = useState(false);
    const params = useParams();
    const profileUserId = params.id;
    const user = JSON.parse(localStorage.getItem("profile"));

    const otherUserInfor = userInfoStore((state) => state.otherUserInfor);

    return (
        <div className="InfoCard">
            <div className="InfoHead">
                <h4>Profile Info</h4>
                {user.data._id === profileUserId ? (
                    <div>
                        <UilPen
                            width="2rem"
                            height="1.2rem"
                            onClick={() => setModalOpened(true)}
                        />
                        <ProfileModal
                            modalOpened={modalOpened}
                            setModalOpened={setModalOpened}
                            data={user.data}
                        />
                    </div>
                ) : (
                    ""
                )}
            </div>
            <div className="infor">
                <div className="infor-item">
                    <div className="infor-icon">
                        <FaHeart />
                        <b>Relationship </b>
                    </div>
                </div>
                <div className="infor-item">{user.data.relationship}</div>
            </div>
            <div className="infor">
                <div className="infor-item">
                    <div className="infor-icon">
                        <FaCity />
                        <b>Country </b>
                    </div>
                </div>
                <div className="infor-item">{user.data.country}</div>
            </div>
            <div className="infor">
                <div className="infor-item">
                    <div className="infor-icon">
                        <FaTransgender />
                        <b>Gender </b>
                    </div>
                </div>
                <div className="infor-item">{user.data.gender}</div>
            </div>
            <div className="infor">
                <div className="infor-item">
                    <div className="infor-icon">
                        <MdWorkOutline />
                        <b>Job </b>
                    </div>
                </div>
                <div className="infor-item">{user.data.workAt}</div>
            </div>

            {/* <div className="info">
                <span>
                    <b>Country </b>
                    <span>{user.data.country}</span>
                </span>
            </div>

            <div className="info">
                <span>
                    <b>Gender </b>
                    <span>{user.data.gender}</span>
                </span>
            </div>
            <div className="info">
                <span>
                    <b>Job </b>
                    <span>{user.data.workAt}</span>
                </span>
            </div> */}
        </div>
    );
};
