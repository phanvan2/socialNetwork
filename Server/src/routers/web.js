import express from "express"; 

import { User, Contact, Notification } from "../controllers/index";

let router = express.Router(); 

let initRouter = (app) => {
    router.get("/", function(req, res){
        res.send("xin chào mọi người");
    }); 

    router.post("/auth/register",User.registerUser ) ; 
    router.post("/auth/login",User.login); 
    router.get("/auth/verifyEmail/:token_verify", User.verifyEmail); 
    router.post("/auth/request-active-Email", User.sendAcitveEmail); 

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

    // router.get("/contact/search-friends/:keyword", contactValid.searchFriends, contact.searchFriends);


    router.get("/notification/read-more", Notification.readMore);
    router.put("/notification/mark-all-as-read", Notification.markAllAsRead);

    return app.use("/", router);
}
export default initRouter; 
