import mongoose from "mongoose";
import bluebird from "bluebird" ;



let connectDB = () => { 
    mongoose.Promise = bluebird ; 
    console.log("Okee"); 
    console.log(process.env.DB_HOST) ; 
    // let URI = `mongodb+srv://${process.env.phanvan}:${process.env.DB_PASSWORD}@cluster0.ywiyree.mongodb.net/${process.env.WEBSHOP}?retryWrites=true&w=majority`;
    let URI =  `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}` ;  // connect mongodb local
    console.log(URI); 
    return mongoose.connect(URI);
}

export default connectDB ; 

