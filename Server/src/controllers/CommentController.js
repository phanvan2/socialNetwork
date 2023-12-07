import _ from "lodash";

import {Comment} from "../services/index";


let createNew =  async (req, res)   =>{
    if(!_.isEmpty(req.body)){
        console.log(req.body);
        try{
            let req_user = jwt.verify(req.body.user_token, process.env.JWT_KEY);
            let contactId = req.body.contactId; 

            let result = await Comment.addNew(req_user, contactId) ; 
        //  console.log(newContact) ; 
            return res.status(200).send(result) ; 
        }catch(error){
            return res.send(error);
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