import _ from "lodash" ; 
import jwt from "jsonwebtoken";
import fsExtra from "fs-extra";
import multer from "multer"; 
import { v4 as uuidv4 } from 'uuid';

import { transValidation, transSuccess, transError, transMail } from "../../lang/en";
import {  Post } from "../services";
import {app} from './../config/app'; 


let storagePost = multer.diskStorage({
    destination: (req, file , callback) => {
        callback(null , app.post_directory);
    },
    filename: (req , file , callback) => {
        let math = app.post_type; 
        if(math.indexOf(file.mimetype) === -1){
            return callback(transError.image_type, null ,  )
        }
        let postName =  `${Date.now()}-${uuidv4()}-${file.originalname}`; 
        callback(null, postName) ; 
    }

}); 

let postUploadFile = multer({
    storage: storagePost,
    limits: {fileSize: app.post_limit_size},

}).single("post_image"); 



let addNewPost = async(req , res) => {
    console.log("add new post controllerrrrrrrrr") ; 
    postUploadFile(req, res, async(error) => {
        if(error){
            if(error.message){
                return res.send(transError.image_size); 
            }
            return res.send(error); 
        }
        console.log(req.file); 
        console.log(req) ;
        try {
            if(_.isEmpty(req)){
                res.send({data: false, message:transValidation.data_empty})
            }else { 
                console.log(req.body);
                try {
                    let req_user = jwt.verify(req.body.user_token, process.env.JWT_KEY);
                    let data = {
                        userId:     req_user._id,
                        desc:       req.body.desc,
                        image:      req.file.filename
                    }
                    let result = await Post.addNewPost(data); 
                    console.log(result) ; 
                    if(result){
                        res.status(200).send({data: true, message: transSuccess.addNewPost}); 
            
                    }else{
                        res.send({data: false, message:transError.addNewPost}); 

                    }
                } catch (error) {
                    console.log(error);
                    res.send({data: false, message:transError.addNewPost}); 
                }
            }

        } catch (error) {
            console.log(error); 
            return ; 
        }
    }); 
};


let getPostbyIdPost = async(req, res) => {
    let idPost = req.params.idPost; 
    let data = await Post.getPostbyIdPost(idPost); 
    if(data)
        res.send(data) ; 
    else{
        res.send(false)  ; 
    }
}

let getPostbyIdUser = async(req, res) => {
    let idUser = req.params.idUser; 
    let data = await Post.getPostbyIdUser(idUser); 
    if(data)
        res.send({data: data}) ; 
    else{
        res.send({data: false})  ; 
    }
}

let getPostsByFriend = async (req,res) => {
    if(req.query.user_token){
        try{
            let req_user = jwt.verify(req.query.user_token, process.env.JWT_KEY);
            let currentUserId  = req_user._id;  
            let posts = await Post.getPostsByFriend(currentUserId);
            res.send(posts);
            // if(posts.length > 0){
            //     return res.status(200).send(posts); 

            // } else{
            //     return res.send([]); 

            // }
        }catch(error){
            return res.status(500).send(error);
        }
    }else{
        return res.send([]); 
    }
}

let searchPost = async(req, res) => {
    console.log("vào đây đi iêm"); 

    if(req.query.user_token){
        try{
            let req_user = jwt.verify(req.query.user_token, process.env.JWT_KEY);
            let currentUserId  = req_user._id; 
            let keyword = req.query.keyword ; 
    
            let posts = await Post.searchPost(currentUserId, keyword);
            return res.status(200).send(posts); 

          
        }catch(error){
            return res.status(500).send([]);
        }
    }else{
        return res.send([]); 
    }
}

export default {
    addNewPost, 
    getPostbyIdUser, 
    getPostsByFriend, 
    searchPost,
    getPostbyIdPost
} ; 