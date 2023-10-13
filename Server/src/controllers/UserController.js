import _ from "lodash" ; 

import { transValidation, transSuccess, transError } from "../../lang/en";
import { User } from "../services";

let registerUser = async(req , res) => {
    if(_.isEmpty(req.body)){
        res.status(400).send(transValidation.data_empty)
    }else {
        let result = await User.registerUser(req.body); 
        if(result){
            res.status(200).send({data: true, message: transSuccess.register_user}); 

        }else{
            res.send({data: false, message:transError.register_user}); 

        }
    }
};

let login = async(req, res) => {
    if(_.isEmpty(req.body)){
        res.status(400).send(transValidation.data_empty) ; 
    }else {
        try {
            let result = await User.loginUser(req.body); 
            if(result){
                res.status(200).send({data:result, message: transSuccess.login_user}); 
    
            }else{
                res.status(500).send( {data: false, message:transError.login_user}); 
    
            }
        } catch (error) {
            res.status(500).send(error); 

        }
 
        
    }
}; 



export default {registerUser, login} ; 