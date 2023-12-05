import _ from "lodash" ; 
import jwt from "jsonwebtoken";

import { Research } from "../services";

let addNewResearch = async(req , res) => {
    if(!_.isEmpty(req.body)){
        let token_user = jwt.verify(req.body.token, process.env.JWT_KEY);

        let result = await Research.addNewResearch(token_user._id, req.body.content) ; 
        if(result)
            res.send(true)
        else
            res.send(false)
    }else { 
        res.send(false)

    }
};

let getResearchByIdUser = async(req, res) => {
     if(req.query.token){
        let token_user = jwt.verify(req.query.token, process.env.JWT_KEY);
        let userId  = token_user._id;
        let result = await Research.getResearchByIdUser(userId);
    
        res.send(result) ; 
    }else {  
        res.send([])
    }
}; 


export default {
    addNewResearch,
    getResearchByIdUser

} ; 