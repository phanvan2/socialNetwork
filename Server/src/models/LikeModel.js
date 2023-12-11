import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema; 

const LikeSchema = new Schema({
    userId: String, 
    postId: String,
    creatAt:    {type: Number, default: Date.now},
    updateAt:   {type: Number, default: Date.now},
    deleteAt:   {type: Number, default: Date.now},
})


LikeSchema.statics = {
    createNew(data) {
        return this.create(data) ; 
    },
    removeByIdUser(idUser, idPost){
        return this.deleteOne(  {
            $and: [{"postId": idPost, "userId": idUser }]
        }).exec();
    },
    getLikeByUser(userId){
        return this.find({"userId": userId}).exec();
    }, 
    getLikeByPost(postId){
        return this.find({"postId": postId}).exec();
    }, 
    getAllLike(){
        return this.find().exec();
    }, 
    getQuanityLike(idPost) {
        return this.count({"postId": idPost}).exec();
    },
    checkLiked(idPost, idUser){
        return this.count({            
            $and: [{"postId": idPost, "userId": idUser }]
        }).exec();
    }

}


export default mongoose.model("like", LikeSchema ) ; 


