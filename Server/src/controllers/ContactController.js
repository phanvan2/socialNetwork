import {Contact} from "./../services/index"; 
import { transSuccess, transError } from "../../lang/en";

import _ from "lodash";
import jwt from "jsonwebtoken";

let findUserContact = async (req, res) =>{
    if(req.query.user_token){
        try{
            console.log("vào đây");
            let req_user = jwt.verify(req.query.user_token, process.env.JWT_KEY);
            let currentUserId  = req_user._id; 
            let keyword = req.params.keyword ; 
    
            let users = await Contact.findUserContact(currentUserId, keyword);
            if(users.length > 0){
                return res.status(200).send({data: users, message:transSuccess.findContact }); 

            } else{
                return res.send({data: false, message:transError.findContact }); 

            }
        }catch(error){
            return res.status(500).send(error);
        }
    }else{
        return res.send({data: false, message:transError.error_ }); 
    }
};

let addNew = async (req, res) =>{

    if(!_.isEmpty(req.body)){
        console.log(req.body);
        try{
            let req_user = jwt.verify(req.body.user_token, process.env.JWT_KEY);
            let contactId = req.body.contactId; 

            let newContact = await Contact.addNew(req_user, contactId) ; 
        //  console.log(newContact) ; 
            return res.status(200).send({data: newContact, message: transSuccess.sendReqContact}) ; 
        }catch(error){
            return res.status(500).send(error);
        }
    }{
        return res.status(200).send({data:false, message: transError.sendReqContact}) ; 

    }
};

let removeContact = async(req, res) => {

    if(!_.isEmpty(req.body)){
        console.log(req.body);
        try{
            let req_user = jwt.verify(req.body.user_token, process.env.JWT_KEY);
            let contactId = req.body.contactId; 

            let removeContact = await Contact.removeContact(req_user._id, contactId) ; 
             console.log(removeContact) ; 
            return res.status(200).send({data: removeContact, message: transSuccess.sendReqContact}) ; 
        }catch(error){
            return res.send(error);
        }
    }{
        return res.send({data:false}) ; 

    }
}

let removeRequestContactSent = async (req, res) =>{

    if(!_.isEmpty(req.body)){
        try{
            let req_user = jwt.verify(req.body.user_token, process.env.JWT_KEY);
            let contactId = req.body.contactId;  

            let removeReq = await Contact.removeRequestContactSent(req_user._id, contactId) ; 
            return res.status(200).send({data: removeReq}) ; 
        }catch(error){
            return res.send(error);
        }
    }{
        return res.send({data:false}) ; 

    }
};

let removeRequestContactReceived = async (req, res) =>{

    if(!_.isEmpty(req.body)){
        try{
            let req_user = jwt.verify(req.body.user_token, process.env.JWT_KEY);
            let contactId = req.body.contactId;  
            
            let removeReq = await Contact.removeRequestContactReceived(req_user._id, contactId) ; 
            return res.status(200).send( removeReq) ; 
        }catch(error){
            return res.send(error);
        }
    }{
        return res.send(false) ; 

    }
};

let approveRequestContactReceived = async (req, res) =>{
    console.log("controller contact approve") ; 
    console.log(req.bođy);  

    if(!_.isEmpty(req.body)){
        console.log(req.body);  
        try{
            let req_user = jwt.verify(req.body.user_token, process.env.JWT_KEY);

            let currentUserId  = req_user._id; 
            let contactId = req.body.contactId; 
            let approveReq = await Contact.approveRequestContactReceived(currentUserId, contactId) ; 
        
            return res.status(200).send(approveReq) ; 
        }catch(error){
            return res.status(500).send(error);
        }
    }
    return res.send("lỗi rùi "); 
};

let readMoreContacts = async (req, res) => {
    try {
        // get skip number from query paramm
        let skipNumberContacts = +(req.query.skipNumber); 
        // console.log(skipNumberContacts);
        
        // get more items 
        let newContacts = await Contact.readMoreContacts(req.user._id, skipNumberContacts);
        return res.status(200).send(newContacts); 

    } catch (error) {
        console.log(error) ; 
        return res.status(500).send(error);
    }
};

let readMoreContactsSent = async (req, res) => {
    try {
        // get skip number from query paramm
        let skipNumberContacts = +(req.query.skipNumber); 
        // console.log(skipNumberContacts);
        
        // get more items 
        let newContacts = await Contact.readMoreContactsSent(req.user._id, skipNumberContacts);
        return res.status(200).send(newContacts); 

    } catch (error) {
        console.log(error) ; 
        return res.status(500).send(error);
    }
};


let readMoreContactsReceived = async (req, res) => {
    try {
        // get skip number from query paramm
        let skipNumberContacts = +(req.query.skipNumber); 
        // console.log(skipNumberContacts);
        
        // get more items 
        let newContacts = await Contact.readMoreContactsSent(req.user._id, skipNumberContacts);
        return res.status(200).send(newContacts); 

    } catch (error) {
        console.log(error) ; 
        return res.status(500).send(error);
    }
};

let getlistFriends = async (req, res) =>{
    console.log("get list friend controller");
    console.log(req.query) ; 
    try{
        let req_user = jwt.verify(req.query.user_token, process.env.JWT_KEY);
        console.log(req_user) ;
        let currentUserId  = req_user._id; 
    
        let users = await Contact.getListFriends(currentUserId);
        console.log(users);
        // console.log("user"+users);
        return res.status(200).send(users); 
    }catch(error){
        console.log(error);
        return res.send({data: false});
    }
};


export default{
    findUserContact: findUserContact, 
    addNew: addNew,
    removeRequestContactSent: removeRequestContactSent,
    removeRequestContactReceived: removeRequestContactReceived,
    readMoreContacts: readMoreContacts,
    readMoreContactsSent: readMoreContactsSent,
    readMoreContactsReceived: readMoreContactsReceived, 
    approveRequestContactReceived: approveRequestContactReceived,
    removeContact: removeContact,
    getlistFriends: getlistFriends

}
