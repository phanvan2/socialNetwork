import express from "express"; 


let router = express.Router(); 

let initRouter = (app) => {
    router.get("/", function(req, res){
        res.send("xin chào mọi người");
    }); 

    
    
    return app.use("/", router);
}
export default initRouter; 
