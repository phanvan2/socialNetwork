import bcrypt from "bcrypt" ; 
import UserModel from "../models/UserModel";

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
            let userItem = await UserModel.findByEmail( item.email); 
            console.log(userItem);
            if(userItem){
                let checkPass = bcrypt.compareSync(item.password + "", userItem.password + "");
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
                    resolve(userInfor);
                }else{
                    resolve(false);
                }
            }else{
                resolve(false);
            }
        } catch (error) {
            resolve(false); 

        }
    })
}; 



export default {registerUser, loginUser} ;
