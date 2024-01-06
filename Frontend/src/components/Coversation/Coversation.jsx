import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getUser } from "../../api/UserRequest";
import defaultProfile from "../../img/default.png";
import { User } from "../User/User";
import { friendsOnlineStore } from "../../store";

const Coversation = ({ data, currentUser }) => {
  const [userData, setUserData] = useState(null);
  const friendsOnline = friendsOnlineStore((state) => state.friendsOnline);

  useEffect(() => {
    // const userId = data.members.find((id) => id !== currentUser)

    const getUserData = async () => {
      try {
        const { data } = await getUser(currentUser);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, []);

  React.useEffect(() => {
    const x = document.querySelectorAll(`span.status-user`);
    x.forEach((value) => {
      value.classList.remove("user-online");
      value.classList.add("user-offine");
      value.innerHTML = "offline";

      friendsOnline.forEach((userId) => {
        if (value.id == `user${userId}`) {
          value.classList.remove("user-offline");
          value.classList.add("user-online");
          value.innerHTML = "online";
        }
      });
    });
  }, [friendsOnline]);

  return (
    <>
      <div className="follower conversation">
        <User person={data} key={data._id} disableClick="true"></User>
        {/* <div>
          <div className="follower" style={{ cursor: "pointer" }}>
            <div>
              <img
                src={`${process.env.REACT_APP_AVATAR_IMAGE_FOLDER}${data.avatar}`}
                alt=""
                className="followerImg"
              />

              <div className="name">
                <span>{data.firstName}</span>
                <span className="status-user user-offline">offline</span>
              </div>
            </div>
          </div> */}
      </div>
    </>
  );
};

export default Coversation;
