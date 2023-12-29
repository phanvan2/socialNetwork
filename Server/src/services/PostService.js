import bcrypt from "bcrypt" ; 
import fs from "fs-extra" ; 
import TfIdf from 'node-tfidf';
// import fs from 'fs';

import PostModel from "../models/PostModel";
import UserModel from "../models/UserModel";
import ResearchModel from "../models/ResearchModel";

import ResearchService from "./ResearchService";
import ContactService from "./ContactService";
import train_model from "./train_model";
import {app} from "../config/app" ; 

let addNewPost =  (item ) => {
    return new Promise(async (resolve, reject) => {
        try{
            let data = {
                userId:     item.userId,
                desc:       item.desc,
                title:      item.title,
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
                    title: post.title,
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
                        title: post.title,
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
                    title: post.title,
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

let removeById =(idUser, idPost) => {
    return new Promise(async (resolve, reject) => {
        try{
            let post = await PostModel.getPostbyIdPost(idPost); 
            await fs.remove(`${app.post_directory}/${post.image}`); 
            
            let result = await PostModel.removePost(idUser, idPost);
            console.log(result) ; 
            if ( result.deletedCount === 0){
                resolve(false) ; 
            } 
            
            resolve(true);

           
        }catch(err){
            reject(err); 
        }
    
    })
}

let updatePost = (idPost, item) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(item.image){
                let post = await PostModel.getPostbyIdPost(idPost); 
                await fs.remove(`${app.post_directory}/${post.image}`); 
            }

            let resultUpdate = await PostModel.updatePost( idPost, item) ; 
            if(resultUpdate)
                return resolve(resultUpdate.image) ; 
            else
                return resolve(false) ;

                
        } catch (error) {
            console.log(error) ; 
            return resolve(false); 

        }
    })
}

let getRealTime = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let research = await ResearchModel.getLimitByIdUser(idUser) ; 
            let dataset1 = await PostModel.getPostAll();

            let dataset = []; 
            research.map((value) => {
                dataset.push(value.contentSearch) ; 
            })


            const aaa = (fs.readFileSync('model.json', 'utf-8'));
            var tfidf = new TfIdf(JSON.parse(aaa));

            let trainData1 = [];
            let data_  = [] ; 
            dataset.map((value) => {
              tfidf.tfidfs(value, function(i, measure) {
                // console.log('document #' + dataset[i] + ' is ' + measure);
                if(measure > 0){
                  // console.log(dataset[i].title);
                  // console.log(data_.indexOf(dataset[i].title))
                  if(data_.indexOf(i) < 0){
                    let dataa = {
                      ...dataset1[i]._doc,
                      similarities: measure
                    }
                    data_.push(i) ; 
                    trainData1.push(dataa); 
                  }
                 
                }
              });
            })
            console.log(trainData1);


            // let result = await Promise.all(train_model.prediction(dataset)); 
            let result1 = trainData1.map(async (post) => {
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
                    title: post.title,
                    image: post.image,
                    likes: post.like,
                    creatAt: post.creatAt,
                    updateAt: post.updateAt,
                    deleteAt: post.deleteAt,
                }     
            });            return resolve(await Promise.all(result1)); 
                
        } catch (error) {
            console.log(error) ; 
            return resolve(false); 

        }
    })
}
export default {addNewPost, getPostbyIdUser , getPostsByFriend ,searchPost, getPostbyIdPost,removeById, updatePost, getRealTime } ;

