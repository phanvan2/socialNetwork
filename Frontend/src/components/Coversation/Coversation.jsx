import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { getUser } from '../../api/UserRequest'
import defaultProfile from '../../img/default.png'

const Coversation = ({ data, currentUser }) => {

    const [userData, setUserData] = useState(null)

    useEffect(() => {
        // const userId = data.members.find((id) => id !== currentUser)

        const getUserData = async () => {
            try {
                const { data } = await getUser(currentUser)
                setUserData(data)
            } catch (error) {
                console.log(error);
            }

        }
        getUserData()
    }, [])
    return (
        <>
            <div className='follower conversation'>


            <div>
            <div className='follower' style={{cursor : 'pointer'}}>
                <div>
                <img src="http://localhost:5000/images/users/1702345261633-68eafff2-4c9b-4ce5-82ab-6bd379a686a6-IMG_3896.jpg" alt="" className='followerImg' />


                    <div className='name'>
                        <span>Phan van</span>
                        <span className='status-user user-offline' >offline</span>

                    </div>
                </div>
              
            </div>
        </div>

                {/* <div>
                    <div className="online-dot"></div>
                    <img src={userData?.profilePicture ? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture :
                        defaultProfile} alt=""
                        className='followerImage'
                        style={{ width: "50px", height: "50px" }} />
                    <div className='name' style={{ fontSize: "0.8rem" }}>
                        <span>{userData?.firstname} {userData?.lastname}</span>
                        <span>Online</span>
                    </div>
                </div>
            </div>
            <hr style={{width : "85%" , border : "0.1px solid #ececec"}}/>
            <div className='follower conversation'>
                <div>
                    <div className="online-dot"></div>
                    <img src={userData?.profilePicture ? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture :
                        defaultProfile} alt=""
                        className='followerImage'
                        style={{ width: "50px", height: "50px" }} />
                    <div className='name' style={{ fontSize: "0.8rem" }}>
                        <span>{userData?.firstname} {userData?.lastname}</span>
                        <span>Online</span>
                    </div>
                </div> */}
            </div>
        </>
    )
}

export default Coversation
