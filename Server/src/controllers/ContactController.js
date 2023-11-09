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
        try{
            let req_user = jwt.verify(req.body.user_token, process.env.JWT_KEY);
            let currentUserId  = req_user._id; 
            let contactId = req.body.contactId; 

            let newContact = await Contact.addNew(currentUserId, contactId) ; 
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
    try{
        let currentUserId  = req.user._id; 
        let contactId = req.body.uid; 
        // console.log(req);
        let removeContact = await contact.removeContact(currentUserId, contactId) ; 
       // console.log(removeReq) ; 
        //console.log("remove contact controller")
        return res.status(200).send({success: !!removeContact}) ; 
    }catch(error){
        return res.status(500).send(error);
    }
}
let removeRequestContactSent = async (req, res) =>{

    try{
        let currentUserId  = req.user._id; 
        let contactId = req.body.uid; 

        let removeReq = await contact.removeRequestContactSent(currentUserId, contactId) ; 
       // console.log(removeReq) ; 
        //console.log("remove contact controller")
        return res.status(200).send({success: !!removeReq}) ; 
    }catch(error){
        return res.status(500).send(error);
    }
};

let removeRequestContactReceived = async (req, res) =>{

    try{
        let currentUserId  = req.user._id; 
        let contactId = req.body.uid; 

        let removeReq = await contact.removeRequestContactReceived(currentUserId, contactId) ; 
       // console.log(removeReq) ; 
        //console.log("remove contact controller")
        return res.status(200).send({success: !!removeReq}) ; 
    }catch(error){
        return res.status(500).send(error);
    }
};

let approveRequestContactReceived = async (req, res) =>{
    if(!_.isEmpty(req.body)){

        try{
            let req_user = jwt.verify(req.body.user_token, process.env.JWT_KEY);

            let currentUserId  = req_user._id; 
            let contactId = req.body.contactId; 

            console.log(req_user)
            console.log(contactId);
            let approveReq = await Contact.approveRequestContactReceived(currentUserId, contactId) ; 
        
            return res.status(200).send({success: !!approveReq}) ; 
        }catch(error){
            return res.status(500).send(error);
        }
    }
};

let readMoreContacts = async (req, res) => {
    try {
        // get skip number from query paramm
        let skipNumberContacts = +(req.query.skipNumber); 
        // console.log(skipNumberContacts);
        
        // get more items 
        let newContacts = await contact.readMoreContacts(req.user._id, skipNumberContacts);
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
        let newContacts = await contact.readMoreContactsSent(req.user._id, skipNumberContacts);
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
        let newContacts = await contact.readMoreContactsSent(req.user._id, skipNumberContacts);
        return res.status(200).send(newContacts); 

    } catch (error) {
        console.log(error) ; 
        return res.status(500).send(error);
    }
};

let searchFriends = async (req, res) =>{
    let errorArr = [];
    let validationErrors = validationResult(req); 

    if(!validationErrors.isEmpty()){
        let errors = Object.values(validationErrors.mapped());
        errors.forEach(item => {
            errorArr.push(item.msg) ; 
        }) ; 
        return res.status(500).send(errorArr);
    }
    try{
        let currentUserId  = req.user._id; 
        let keyword = req.params.keyword ; 
        console.log("search friends Contact controller");

        console.log(currentUserId)
        console.log(keyword);
        let users = await contact.searchFriends(currentUserId, keyword);
        console.log(users);
        // console.log("user"+users);
        return res.render("main/groupChat/sections/_searchFriends", {users}); 
    }catch(error){
        return res.status(500).send(error);
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
    searchFriends: searchFriends

}
