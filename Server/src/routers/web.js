import express from "express"; 

import { User } from "../controllers/index";

let router = express.Router(); 

let initRouter = (app) => {
    router.get("/", function(req, res){
        res.send("xin chào mọi người");
    }); 

    router.post("/auth/register",User.registerUser ) ; 
    router.post("/auth/login",User.login); 
    router.get("/auth/verifyEmail/:token_verify", User.verifyEmail); 
    router.post("/auth/request-active-Email", User.sendAcitveEmail); 
    
    return app.use("/", router);
}
export default initRouter; 
