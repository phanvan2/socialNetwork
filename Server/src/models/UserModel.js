import mongoose from "mongoose";

const Schema = mongoose.Schema; 

const UserSchema = new Schema({
    email: {type: String, trim: true},
    lastName: String,
    firstName: String,
    password: String,
    avatar:     {type: String, default: "avatar-default.png"},
    gender:     {type: String, default: "male"},
    isActive:   {type: Boolean, default: false},
    creatAt:    {type: Number, default: Date.now},
    updateAt:   {type: Number, default: Date.now},
    deleteAt:   {type: Number, default: Date.now},
})


UserSchema.statics = {
    createNew(data) {
        return this.create(data) ; 
    },
    findByEmail(emailUser){
        return this.findOne({"email": emailUser}).exec();
    },

}
export default mongoose.model("user", UserSchema ) ; 


