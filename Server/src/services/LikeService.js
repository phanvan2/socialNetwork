import LikeModel from "../models/LikeModel";
import UserModel from "../models/UserModel";

let addNew =  (req_user, data) =>{
    return new Promise(async(resolve, reject) =>{

        let item = { 
            userId: req_user._id, 
            postId: data.postId,
        }
        let result = await LikeModel.createNew(item) ; 
        if(result){
            resolve(true) ;
        }else{
            resolve(false) ; 
        }
    
    }); 
}

let getLikeByPost =  (idPost) =>{
    return new Promise(async(resolve, reject) =>{ 
         let likes = await LikeModel.getLikeByPost(idPost) ; 
        let results = likes.map( async(value) => {
            let user = await UserModel.findUserById(value.userId);
            return {
                userId: value.userId, 
                lastName: user[0].lastName,
                firstName: user[0].firstName,
                avatar: user[0].avatar,
                email: user[0].email,
                postId: value.postId,
                creatAt:   value.creatAt,
                updateAt:  value.updateAt,
            }
        }) ; 
        if(results){
            return resolve(await Promise.all(results)) ;
        }else{
            return resolve(false) ; 
            
        }
    
    }); 
}

let removeByIdUser =(idUser, idPost) => {
    return new Promise(async(resolve, reject) =>{

        let result = await LikeModel.removeByIdUser(idUser, idPost) ; 
        if(result){
            resolve(true) ;
        }else{
            resolve(false) ; 
        }
    
    }); 
} 

let getIntreactionPost =  (idPost, idUser) =>{
    return new Promise(async(resolve, reject) =>{ 
        let quanityLike = await LikeModel.getQuanityLike(idPost) ; 
        let checkLike = await LikeModel.checkLiked(idPost, idUser); 
        let results = {
            checkLike: checkLike,
            quanityLike: quanityLike,
        }
        if(results){
            return resolve((results)) ;
        }else{
            return resolve(false) ; 
            
        }
    
    }); 
}

export default {
    addNew: addNew,
    getLikeByPost: getLikeByPost, 
    removeByIdUser: removeByIdUser, 
    getIntreactionPost: getIntreactionPost
}