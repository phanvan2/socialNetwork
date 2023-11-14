import  express  from "express";
import cors from "cors";
import * as dotenv from 'dotenv'; 
import { Server } from "socket.io";
import http from "http";


import initRoutes  from "./routers/web"; 
import connectDB from "./config/connectDB";
import initSockets from "./sockets/index"; 

const app = express();
let server = http.createServer(app) ; 


let clientId = [];

let io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
});


  


// bb.extend(app);

// const upload = multer();
// app.use(upload.array);

// hello js 
dotenv.config({ path: './sh/env.sh'}) ; 

connectDB()
    .then(() => console.log("connected DB"))
    .catch((err) => console.log(err)) ; 

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRoutes(app);
initSockets(io);


// server.listen(4000,()=> {console.log("hêòlakf")}); 

server.listen(process.env.APP_HOST);

