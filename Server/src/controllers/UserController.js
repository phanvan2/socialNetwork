import _ from "lodash" ; 

import { transValidation, transSuccess, transError } from "../../lang/en";
import { User } from "../services";

let registerUser = async(req , res) => {
    if(_.isEmpty(req.body)){
        res.status(400).send(transValidation.data_empty)
    }else {
        let result = await User.registerUser(req.body); 
        if(result){
            res.status(200).send(transSuccess.register_user); 

        }else{
            res.send(transError.register_user); 

        }
    }
  

   
};

export default {registerUser} ; 