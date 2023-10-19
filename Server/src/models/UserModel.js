import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema; 

const UserSchema = new Schema({
    email: {type: String, trim: true},
    lastName: String,
    firstName: String,
    password: String,
    avatar:     {type: String, default: "avatar-default.png"},
    gender:     {type: String, default: "male"},
    isActive:   {type: Boolean, default: false},
    verifyToken:{type: String, default: null} ,
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

    updateTokenByEmail(id, token){
        return this.findByIdAndUpdate(id, {"verifyToken": token}).exec(); 
    },

    activeEmail(id, token, email ){
        return this.findByIdAndUpdate({
            "_id": id,
            "email": email, 
            "verifyToken": token
        }, {"isActive": true}). exec() ; 
    }

    // updatePassword(id, hashedPassword){
    //     return this.findByIdAndUpdate(id, {"local.password": hashedPassword}).exec();
    // },
}

UserSchema.methods = {
    comparePassword(password){
        return bcrypt.compare(password+"", this.password+""); 
    }
}

export default mongoose.model("user", UserSchema ) ; 


