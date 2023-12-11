import _ from "lodash";
import jwt from "jsonwebtoken";

import {Like} from "../services/index";


let createNew =  async (req, res)   =>{
    if(!_.isEmpty(req.body)){

        try{
            let req_user = jwt.verify(req.body.user_token, process.env.JWT_KEY);
            let data = {
                postId: req.body.idPost,
            }
            let result = await Like.addNew(req_user, data) ; 
            if(result)
                return res.status(200).send(true) ;
            else{
                return res.send(false); 
            }
        }catch(error){
            return res.send(false);
        }
    }{
        return res.send(false) ; 

    }
};

let getIntreactionPost = async(req, res) => {
    if(req.query.idPost){
        let idUser = null ; 
        try {
            let req_user = jwt.verify(req.query.user_token, process.env.JWT_KEY);
            idUser = req_user._id; 
        } catch (error) {
            
        }

        try{
            let result = await Like.getIntreactionPost(req.query.idPost, idUser) ; 
            return res.status(200).send(result) ; 
        }catch(error){
            return res.send(error);
        }
    }{
        return res.send(false) ; 

    }

}

let getLikeByPost =  async (req, res)   =>{
    if(req.params.idPost){
       
        try{
            let result = await Like.getLikeByPost(req.params.idPost) ; 
            return res.status(200).send(result) ; 
        }catch(error){
            return res.send(error);
        }
    }{
        return res.send(false) ; 

    }
};

let removeByIdUser = async(req, res) => {
    console.log("xóa qq"); 
    console.log(req.body) ;
    if(!_.isEmpty(req.body)){
        console.log(req.body) ; 
        try{
            let req_user = jwt.verify(req.body.user_token, process.env.JWT_KEY);
           
            let result = await Like.removeByIdUser(req_user._id, req.body.idPost) ; 
            if(result)
                return res.status(200).send(true) ;
            else{
                return res.send(false); 
            }
        }catch(error){
            return res.send(false);
        }
    }{
        return res.send(false) ; 

    }
}


export default {
    createNew: createNew, 
    getLikeByPost: getLikeByPost, 
    removeByIdUser: removeByIdUser,
    getIntreactionPost: getIntreactionPost
}