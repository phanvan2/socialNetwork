import bcrypt from "bcrypt" ; 
import jwt from "jsonwebtoken";

import UserModel from "../models/UserModel";
import ContactModel from "../models/ContactModel";

let registerUser =  (item ) => {
    return new Promise(async (resolve, reject) => {
        try{
            let userItem = await UserModel.findByEmail(item.email); 
            if(userItem){
                resolve(false) ; 
            }else{
                let saltRounds = 7 ; 
                const salt = bcrypt.genSaltSync(saltRounds);
    
                let data = {
                    email:      item.email,
                    lastName:   item.lastName,
                    firstName:  item.firstName,
                    password:bcrypt.hashSync(item.password + "",salt),
                    gender:     item.gender, 
                }
                let result = await UserModel.createNew(data); 
                resolve(result); 
            }

           
        }catch(err){
            reject(err); 
        }
    
    })
}

let loginUser = (item) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("hello login"); 
            let userItem = await UserModel.findByEmail(item.email); 
            console.log(userItem);
            if(userItem){
                let checkPass = await userItem.comparePassword(item.password) ; 
                console.log(checkPass); 

                if(checkPass){
                    console.log("check pass thànhc ông") ; 
                    let userInfor = {
                        _id : userItem._id,
                        firstName: userItem.firstName,
                        lastName: userItem.lastName,
                        email: userItem.email,
                        avatar: userItem.avatar,
                        isActive: userItem.isActive,
                        createAt: userItem.createAt,
                        gender: userItem.gender,
                        
                    }; 
                    return resolve(userInfor);
                }else{
                    return resolve(false);
                }
            }else{
                return resolve(false);
            }
        } catch (error) {
            console.log(error) ; 
            return resolve(false); 

        }
    })
}; 

let updateTokenVerify = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkMail = await UserModel.findByEmail(email); 
            console.log(checkMail) ; 
            if(checkMail)
                if(!checkMail.isActive){
                    let token = jwt.sign({id: checkMail._id, email: email}, process.env.JWT_KEYMAIL, { expiresIn: '1h' });

                    let resultUpdate = await UserModel.updateTokenByEmail( checkMail._id, token) ; 
                    console.log("hmm"); 
                    console.log(resultUpdate)
                    return resolve({data: resultUpdate, token: token}) ; 
                }

                
            return resolve(false); 
        } catch (error) {
            console.log(error) ; 
            return resolve(false); 

        }
    })
}; 

let verifyEmail = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.JWT_KEYMAIL, async(err, decoded) => {
                if(err) resolve(false) ;
                else {
                    let result = await UserModel.activeEmail(decoded.id, token, decode.email); 
                    if(result)
                        resolve(true) ; 
                    else 
                        resolve(false); 
                }
            });

         } catch (error) {
            console.log(error) ; 
            return resolve(false); 

        }
    })  
}

let getUserById = (id, currentUserId = false) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkExistsContact = "Add Friend"   ; // 0 chưa kết bạn , 1 là chờ xác nhận, 2 là gửi request yêu cầu kết bạn, 3 là friend.  

            if(currentUserId){
                let check = await ContactModel.checkExists(currentUserId, id) ; 


                check ? check.status ? checkExistsContact = "Friend": // check status == true => là bạn bè
                    check.userId == currentUserId ? checkExistsContact = "Cancel request Friend" : // currentUserId == userId => là người gửi yêu cầu kết bạn
                    checkExistsContact = "Confirm friend" : // currentUserId != userid => là người nhận 
                checkExistsContact = "Add Friend" ; 
            }
            let userInfo = await UserModel.findUserById(id); 
 
            let response_user = {
                _id: userInfo[0]._id,
                email: userInfo[0].email,
                lastName: userInfo[0].lastName,
                firstName: userInfo[0].fistName,
                avatar: userInfo[0].avatar,
                gender: userInfo[0].gender,
                statusFriend: checkExistsContact

            };

            if(userInfo)
                return resolve(response_user) ;     
            return resolve(false); 
        } catch (error) {
            console.log(error) ; 
            return resolve(false); 

        }
    })
}
export default {registerUser, loginUser, updateTokenVerify, verifyEmail, getUserById} ;
