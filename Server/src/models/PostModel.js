import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema; 

const PostSchema = new Schema({
    userId: String, 
    descr: String,
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

}


export default mongoose.model("post", PostSchema ) ; 


