import mongoose from "mongoose";

const Schema = mongoose.Schema; 

const UserSchema = new Schema({
    email: {type: String, trim: true},
    lastName: String,
    firstName: String,
    avatar:     {type: String, default: "avatar-default.png"},
    gender:     {type: String, default: "male"},
    isActive:   {type: Boolean, default: true},
    creatAt:    {type: Number, default: Date.now},
    updateAt:   {type: Number, default: Date.now},
    deleteAt:   {type: Number, default: Date.now},
})


UserSchema.statics = {

}
export default mongoose.model("user", UserSchema ) ; 


