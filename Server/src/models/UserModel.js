import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema; 

const UserSchema = new Schema({
    email: {type: String, trim: true},
    lastName: String,
    firstName: String,
    password: String,
    livesin: String,
    country: String,
    workAt: String,
    relationship: String, // Single, engaged, Married
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

    findUserById(id){
        return this.find({_id: id },"_id email lastName firstName avatar isActive gender createAt").exec(); 
    },

    updateProfile(id, data){
        return this.findByIdAndUpdate(id, 
            {
                "lastName": data.lastName, 
                "firstName": data.firstName, 
                "livesin": data.livesin, 
                "country": data.country, 
                "workAt": data.workAt, 
                "relationship": data.relationship, 
                "avatar": data.avatar,
                "gender": data.gender,
                "updateAt": Date.now()


            }).exec(); 

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
    },

    // updatePassword(id, hashedPassword){
    //     return this.findByIdAndUpdate(id, {"local.password": hashedPassword}).exec();
    // },

    /**
     * find all user for add contact
     * @param {array: deprecated UserIds } deprecatedUserIds 
     * @param {sring: keyword search} keyword 
     */
    findAllForAddContact(deprecatedUserIds, keyword){
        return this.find({
            $and: [
                {"_id": {$nin: deprecatedUserIds}},
                {"isActive": true},
                {$or:[
                    {"lastName": {"$regex": new RegExp(keyword, "i")}},
                    {"firstName": {"$regex": new RegExp(keyword, "i")}},
                    {"email": {"$regex": new RegExp(keyword, "i")}}
                ]}
            ]
        }, {_id: 1, email: 1,lastName: 1, firstName: 1,avatar: 1}).exec();
    },


       
    /**
     * 
     * @param {array: friend UserIds } friendIds 
     */
    getListFriends(friendIds){
        return this.find({
            $and: [
                {"_id": {$in: friendIds}},
                {"isActive": true}
               
            ]
        }, {_id: 1, email: 1,lastName: 1, firstName: 1,avatar: 1}).exec();
    },



}

UserSchema.methods = {
    comparePassword(password){
        return bcrypt.compare(password+"", this.password+""); 
    }
}

export default mongoose.model("user", UserSchema ) ; 


