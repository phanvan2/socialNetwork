import  express  from "express";
import cors from "cors";
import * as dotenv from 'dotenv'; 


import initRoutes  from "./routers/web"; 
import connectDB from "./config/connectDB";


const app = express();
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

app.listen(5000);

