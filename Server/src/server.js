import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

import initRoutes from "./routers/web";
import connectDB from "./config/connectDB";
import initSockets from "./sockets/index";

import train_model from "../src/services/train_model";

const app = express();
let server = http.createServer(app);

app.use(express.static("./src/public"));
app.use("/images", express.static("images"));

let clientId = [];

let io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// let trainModel1 = () => {
//     while (true) {
//         setTimeout(async () => {
//             console.log("hello");
//             await train_model.trainModelCollaborative();
//         }, 5000);
//     }
// };
// trainModel1();
// bb.extend(app);

// const upload = multer();
// app.use(upload.array);

// hello js
dotenv.config({ path: "./sh/env.sh" });

connectDB()
    .then(() => console.log("connected DB"))
    .catch((err) => console.log(err));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRoutes(app);
initSockets(io);

// server.listen(4000,()=> {console.log("hêòlakf")});

server.listen(process.env.APP_HOST);
