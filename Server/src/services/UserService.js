import bcrypt from "bcrypt" ; 
import UserModel from "../models/UserModel";
import jwt from "jsonwebtoken";

let registerUser =  (item ) => {
    return new Promise(async (resolve, reject) => {
        try{
            let saltRounds = 7 ; 
            const salt = bcrypt.genSaltSync(saltRounds);

            let data = {
                email:      item.email,
                lastName:   item.lasteName,
                firstName:  item.firstName,
                password:bcrypt.hashSync(item.password + "",salt),
                gender:     item.gender, 
            }
            let result = await UserModel.createNew(data); 
            resolve(result); 
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
                        idUser : userItem._id,
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

export default {registerUser, loginUser, updateTokenVerify, verifyEmail} ;
