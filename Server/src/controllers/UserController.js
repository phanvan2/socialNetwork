import _ from "lodash" ; 
import jwt from "jsonwebtoken";

import { transValidation, transSuccess, transError, transMail } from "../../lang/en";
import { User } from "../services";
import  sendMail from "../config/mailer";


let registerUser = async(req , res) => {
    if(_.isEmpty(req.body)){
        res.send({data: false, message:transValidation.data_empty})
    }else { 
        console.log(req.body);
        let result = await User.registerUser(req.body); 
        console.log(result) ; 
        if(result){
            console.log("đăng ký thahf công");
            res.status(200).send({data: true, message: transSuccess.register_user}); 

        }else{
            console.log("đăng ký thất bại")
            res.send({data: false, message:transError.register_user}); 

        }
    }
};

let login = async(req, res) => {
    if(!_.isEmpty(req.body.token)){
        try {
            let result = jwt.verify(req.body.token, process.env.JWT_KEY);
            res.status(200).send({data:result, message: transSuccess.login_user}); 
        } catch(err) {
            res.send( {data: false, message:transError.login_user}); 
        }
        
    }else if(_.isEmpty(req.body)){
        res.send({data: false, message:transValidation.data_empty}) ; 
    }else {
        console.log(req.body.email) ;
        try {
            let result = await User.loginUser(req.body); 
            if(result){
                console.log("kết quả") ; 
                console.log(result) ;
                let token = jwt.sign(result, process.env.JWT_KEY, { expiresIn: '1h' });
                res.status(200).send({data:result, token: token, message: transSuccess.login_user}); 
    
            }else{
                res.send( {data: false, message:transError.login_user}); 
    
            }
        } catch (error) {
            res.status(500).send(error); 

        }
 
        
    }
}; 

let sendAcitveEmail = async(req, res) => {
    if(_.isEmpty(req.body)){
        res.send({data: false, message:transValidation.data_empty}) ; 
    }else { 
        try {
            let result = jwt.verify(req.body.token, process.env.JWT_KEY);

            // kiểm tra email đã đc đk chưa hoặc tài khoản đã active chưa
            let result_update = await User.updateTokenVerify(result.email);
            console.log("xác minh")
            if(result_update.data && result_update.token){
                sendMail(result.email, transMail.subject , transMail.template(`localhost:5000/auth/verifyEmail/${result_update.token}`))
                    .then((success) => {
                        console.log("gửi mail thành công") ;
                        res.send({data: true, message: transSuccess.sendVerifyEmail}) ; 
                    })
                    .catch(error => {
                        console.log(error) ; 
                        console.log("gửi mail thất bại")
                        res.send( {data: false, message:transError.sendVerifyEmail}); 

                    }) ;

            }else{
                res.send( {data: false, message:transError.sendVerifyEmail}); 

            }

            
        } catch (error) {
            console.log(error);
            res.send( {data: false, message:transError.error_}); 

        }
    }   
}; 

let verifyEmail = async(req, res) => {
    if(req.params.token_verify){
        let result = await User.verifyEmail(req.params.token_verify) ; 
        if(result) 
            res.send({data: true, message: transSuccess.aciveEmail}) ;
        else{
            res.send({data: false, message: transError.aciveEmail}) ; 
        }
    }
}

let getUserById = async(req, res) => {
    if(req.params.id){
        let result = await User.getUserById(req.params.id) ; 
        if(result) 
            res.send({data: result, message: ""}) ;
        else{
            res.send({data: false, message: transError.account_notFound}) ; 
        }
    }
}



export default {
    registerUser, 
    login, 
    sendAcitveEmail, 
    verifyEmail, 
    getUserById
} ; 