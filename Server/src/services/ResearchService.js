import bcrypt from "bcrypt" ; 

import ResearchModel from "../models/ResearchModel";


let addNewResearch =  (userId , contentSearch) => {
    return new Promise(async (resolve, reject) => {
        try{
            let data = {
                userId:    userId,
                contentSearch:contentSearch
            }
            let result = await ResearchModel.createNew(data); 
            if(result)
                resolve(result);
            else   
                resolve(false); 
           
        }catch(err){
            reject(err); 
        }
    
    })
}

let getResearchByIdUser = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try{
            
            let result = await ResearchModel.getResearchByIdUser(idUser); 
            if(result)
                resolve(result);
            else   
                resolve(false); 
           
        }catch(err){
            reject(err); 
        }
    
    })
}


export default {addNewResearch, getResearchByIdUser} ;
