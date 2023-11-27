import express from "express"; 

import { User, Contact, Notification, Post } from "../controllers/index";
import getFileImage from "../helpers/fileHelper" ; 

let router = express.Router(); 

let initRouter = (app) => {
    router.get("/", function(req, res){
        res.send("xin chào mọi người");
    }); 

    router.post("/auth/register",User.registerUser ) ; 
    router.post("/auth/login",User.login); 
    router.get("/auth/verifyEmail/:token_verify", User.verifyEmail); 
    router.post("/auth/request-active-Email", User.sendAcitveEmail); 
    router.get("/check/token/:token", User.checkExpiredToken);

    router.get("/user/:id", User.getUserById);
    
    router.get("/contact/find-users/:keyword",  Contact.findUserContact);
    router.post("/contact/add-new", Contact.addNew);
    // router.delete("/contact/remove-contact", contact.removeContact);
    // router.delete("/contact/remove-request-contact-sent",  contact.removeRequestContactSent);
    // router.delete("/contact/remove-request-contact-received", contact.removeRequestContactReceived);
    // router.get("/contact/read-more-contacts", contact.readMoreContacts);
    // router.get("/contact/read-more-contacts-sent", contact.readMoreContactsSent);
    // router.get("/contact/read-more-contacts-received", contact.readMoreContactsReceived);
    router.put("/contact/approve-request-contact-received", Contact.approveRequestContactReceived);
    router.get("/contact/get-list-friends",  Contact.getlistFriends);

    router.get("/notification/read-more", Notification.readMore);
    router.put("/notification/mark-all-as-read", Notification.markAllAsRead);

    router.post("/post/add-new", Post.addNewPost); 
    router.get("/post/get-by-idUser/:idUser", Post.getPostbyIdUser) ; 



    router.get('/images/:path/:name_image', getFileImage);

    return app.use("/", router);
}
export default initRouter; 
