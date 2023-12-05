import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema; 

const PostSchema = new Schema({
    userId: String, 
    desc: String,
    image: String,
    likes: {type: Array},
    creatAt:    {type: Number, default: Date.now},
    updateAt:   {type: Number, default: Date.now},
    deleteAt:   {type: Number, default: Date.now},
})


PostSchema.statics = {
    createNew(data) {
        return this.create(data) ; 
    },
    getPostbyIdPost(idPost) {
        return this.findOne({"_id": idPost}).exec();
    },
    getPostbyIdUser(idUser){
        return this.find({"userId": idUser}).exec();

    },
    getPostsByFriend(idFriends){
        return this.find({"userId": {$in: idFriends}}); 
    }, 
    searchPost(data){
        return this.find({"desc": {"$regex": new RegExp( data.keyword, "i")}}).exec();
    }

}


export default mongoose.model("post", PostSchema ) ; 


