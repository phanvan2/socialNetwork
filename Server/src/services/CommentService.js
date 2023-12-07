import CommentModel from "../models/CommentModel";

let addNew =  (req_user, data) =>{
    return new Promise(async(resolve, reject) =>{
        let item = { 
            userId: req_user._id, 
            postId: data.postId,
            content: data.content,
        }
        let result = await CommentModel.createNew(item) ; 
        if(result){
            resolve(true) ;
        }else{
            resolve(false) ; 
        }
    
    }); 
}

let getCommentByPost =  (idPost) =>{
    return new Promise(async(resolve, reject) =>{
      
        let comments = await CommentModel.getCommentByPost(idPost) ; 
        let results = comments.map( async(comment) => {
            let user = await UserModel.findUserById(comment.userId);
            return {
                userId: comment.userId, 
                lastName: user[0].lastName,
                firstName: user[0].fistName,
                avatar: user[0].avatar,
                email: user[0].email,
                postId: comment.postId,
                content: comment.content,
                creatAt:   comment.creatAt,
                updateAt:  comment.updateAt,
            }
        }) ; 
        if(results){
            resolve(results) ;
        }else{
            resolve(false) ; 
            
        }
    
    }); 
}


export default {
    addNew: addNew,
    getCommentByPost: getCommentByPost
}