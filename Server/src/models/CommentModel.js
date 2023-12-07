import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema; 

const CommentSchema = new Schema({
    userId: String, 
    postId: String,
    content: String,
    creatAt:    {type: Number, default: Date.now},
    updateAt:   {type: Number, default: Date.now},
    deleteAt:   {type: Number, default: Date.now},
})


CommentSchema.statics = {
    createNew(data) {
        return this.create(data) ; 
    },
    removeCommentById(postId){
        return this.deleteOne({"postId": postId}).exec();
    },
    getCommentByUser(userId){
        return this.find({"userId": userId}).exec();
    }, 
    getCommentByPost(postId){
        return this.find({"postId": postId}).exec();
    }, 
    getAllComment(){
        return this.find().exec();

    }

}


export default mongoose.model("comment", CommentSchema ) ; 


