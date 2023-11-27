import bcrypt from "bcrypt" ; 

import PostModel from "../models/PostModel";
import UserModel from "../models/UserModel";

let addNewPost =  (item ) => {
    return new Promise(async (resolve, reject) => {
        try{
            let data = {
                userId:     item.userId,
                desc:       item.desc,
                image:      item.image,
            }
            let result = await PostModel.createNew(data); 
            resolve(result); 
           
        }catch(err){
            reject(err); 
        }
    
    })
}

let getPostbyIdUser = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try{


            let result = await PostModel.getPostbyIdUser(idUser); 
            
            if(result){
                let result1 = result.map(async (post) => {
                    let user = await UserModel.findUserById(post.userId) ;
                    console.log(user)
                    return {
                        _id: post._id,
                        userId: user[0]._id,
                        lastName: user[0].lastName,
                        firstName: user[0].fistName,
                        avatar: user[0].avatar,
                        email: user[0].email,
                        desc: post.desc,
                        image: post.image,
                        likes: post.like,
                        creatAt: post.creatAt,
                        updateAt: post.updateAt,
                        deleteAt: post.deleteAt,
                    }     
                });
                resolve(await Promise.all(result1)); 
            }else 
                resolve(false) ; 
           
        }catch(err){
            reject(err); 
        }
    
    })
}


export default {addNewPost, getPostbyIdUser} ;
