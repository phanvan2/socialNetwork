import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema; 

const PostSchema = new Schema({
    userId: String, 
    title:String,
    desc: {type: String, default: ""},
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
    getPostAll(){
        return this.find().exec()  ;
    },
    getPostbyIdUser(idUser){
        return this.find({"userId": idUser}).sort({"creatAt":  -1 }).exec();

    },
    getPostsByFriend(idFriends){
        return this.find({"userId": {$in: idFriends}}); 
    }, 
    searchPost(data){
        return this.find({"title": {"$regex": new RegExp( data.keyword, "i")}}).exec();
    },

    removePost(idUser, idPost){
        return this.deleteOne( 
            {$and: [
                {"userId": idUser},
                {"_id": idPost}, 
            ]}
        )
    },
    updatePost(idPost, item) {
        return this.findByIdAndUpdate(idPost, 
            {
                "userId": item.userId, 
                "title": item.title,
                "desc": item.desc,
                "image": item.image,
                "updateAt": Date.now()


            }).exec(); 

    }

}


export default mongoose.model("post", PostSchema ) ; 


