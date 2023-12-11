import _ from "lodash";
import jwt from "jsonwebtoken";

import {Comment} from "../services/index";


let createNew =  async (req, res)   =>{
    if(!_.isEmpty(req.body)){

        try{
            let req_user = jwt.verify(req.body.user_token, process.env.JWT_KEY);
            let data = {
                postId: req.body.idPost,
                content: req.body.content
            }
            let result = await Comment.addNew(req_user, data) ; 
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

let getCommentByPost =  async (req, res)   =>{
    if(req.params.idPost){
       
        try{
            let result = await Comment.getCommentByPost(req.params.idPost) ; 
            return res.status(200).send(result) ; 
        }catch(error){
            return res.send(error);
        }
    }{
        return res.send(false) ; 

    }
};


// removeCommentById(postId){
// },
// getCommentByUser(userId){
// }, 

// getAllComment(){

// }

export default {
    createNew: createNew, 
    getCommentByPost: getCommentByPost
}