import bcrypt from "bcrypt" ; 

import PostModel from "../models/PostModel";
import UserModel from "../models/UserModel";

import ResearchService from "./ResearchService";
import ContactService from "./ContactService";

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

let getPostbyIdPost = (idPost) => {
    return new Promise(async (resolve, reject) => {
        try{


            let post = await PostModel.getPostbyIdPost(idPost); 
            if(post){
                let user = await UserModel.findUserById(post.userId) ;
                let result = {
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
                resolve(result) ; 
            }else 
                resolve(false) ; 
           
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

let getPostsByFriend = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try{
            let contacts = await ContactService.getListFriends(idUser);
            console.log("dddd");
            console.log(contacts) ;
            let idFriends =  contacts.map( (value) => {
                return (value._id); 
            })

            let posts = await PostModel.getPostsByFriend(idFriends)  ;
            let result = posts.map(async(post) => {

                let user = await UserModel.findUserById(post.userId) ;
 
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

            })

            resolve(await Promise.all(result));

           
        }catch(err){
            reject(err); 
        }
    
    })
}

let searchPost =(currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        try{
            let data = {
                idUser: currentUserId, 
                keyword: keyword
            }
            await ResearchService.addNewResearch(currentUserId, keyword);
            let result = await PostModel.searchPost(data)  ;
            resolve(result);

           
        }catch(err){
            reject(err); 
        }
    
    })
}

export default {addNewPost, getPostbyIdUser , getPostsByFriend ,searchPost, getPostbyIdPost} ;
