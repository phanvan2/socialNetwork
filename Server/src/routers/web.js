import express from "express"; 

import { User } from "../controllers/index";

let router = express.Router(); 

let initRouter = (app) => {
    router.get("/", function(req, res){
        res.send("xin chào mọi người");
    }); 

    router.post("/Auth/register",User.registerUser ) ; 
    router.post("/Auth/login",User.login); 
    
    return app.use("/", router);
}
export default initRouter; 
