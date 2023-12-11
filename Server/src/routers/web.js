import express from "express"; 

import { User, Contact, Notification, Post, Research, Comment, Like } from "../controllers/index";
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
    router.put("/user/update-profile", User.updateProfile) ; 
    
    router.get("/contact/find-users/:keyword",  Contact.findUserContact);
    router.post("/contact/add-new", Contact.addNew);
    router.delete("/contact/remove-contact", Contact.removeContact);
    router.delete("/contact/remove-request-contact-sent",  Contact.removeRequestContactSent);
    router.delete("/contact/remove-request-contact-received", Contact.removeRequestContactReceived);
    // router.get("/contact/read-more-contacts", contact.readMoreContacts);
    // router.get("/contact/read-more-contacts-sent", contact.readMoreContactsSent);
    // router.get("/contact/read-more-contacts-received", contact.readMoreContactsReceived);
    router.put("/contact/approve-request-contact-received", Contact.approveRequestContactReceived);
    router.get("/contact/get-list-friends",  Contact.getlistFriends);

    router.get("/notification/read-more", Notification.readMore);
    router.put("/notification/mark-all-as-read", Notification.markAllAsRead);

    router.post("/post/add-new", Post.addNewPost); 
    router.get("/post/get-by-idPost/:idPost", Post.getPostbyIdPost)
    router.get("/post/get-by-idUser/:idUser", Post.getPostbyIdUser) ; 
    router.get("/post/get-by-friend", Post.getPostsByFriend) ; 
    router.get("/post/get-all"); 
    router.get("/post/search-post", Post.searchPost); 

    // router.get("/research/get-all") ; 
    router.get("/research/get-by-idUser", Research.getResearchByIdUser) ; 
    router.post("/research/add-new-research", Research.addNewResearch) ; 

    router.post("/comment/add-new", Comment.createNew); 
    router.get("/comment/get-by-idPost/:idPost", Comment.getCommentByPost); 
    router.put("/comment/updaet-by-idUser"); 
    router.delete("/comment/remove-by-id");

    router.post("/like/add-new", Like.createNew); 
    router.get("/like/get-by-idPost/:idPost", Like.getLikeByPost); 
    router.delete("/like/remove-one", Like.removeByIdUser);
    router.get("/like/get-intereaction", Like.getIntreactionPost) ; 


    router.get('/images/:path/:name_image', getFileImage);

    return app.use("/", router);
}
export default initRouter; 
