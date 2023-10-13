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
                password:   item.password,
                gender:     item.gender, 
            }
            let result = await UserModel.createNew(data); 
            resolve(result); 
        }catch(err){
            reject(err); 
        }
    
    })
}

export default {registerUser} ;
