import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema; 

const ResearchSchema = new Schema({
    userId: String, 
    contentSearch: String,
    creatAt:    {type: Number, default: Date.now},
    updateAt:   {type: Number, default: Date.now},
    deleteAt:   {type: Number, default: Date.now},
})


ResearchSchema.statics = {
    createNew(data) {
        return this.create(data) ; 
    },
    getResearchByIdUser(userId){
        return this.find({"userId": userId}).exec();
    }, 
    getAllResearch(){
        return this.find().exec();

    }

}


export default mongoose.model("research", ResearchSchema ) ; 


