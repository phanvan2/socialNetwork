import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "../../helpers/socketHelpers"; 
import jwt from "jsonwebtoken";


/**
 * 
 * @param io from socket.io lib 
 */
let addNewContact = (io) => {
    let clients = {} ; 
    io.on("connection", (socket) => {
        try {
            console.log("conncec add new con tact");

             // pussh socket id to array
        let req_user = socket.handshake.auth.token;
        let sender = (jwt.verify(req_user, process.env.JWT_KEY));
        console.log(sender);
        clients = pushSocketIdToArray(clients, sender._id, socket.id) ; 

        socket.on("add-new-contact", (data) => {
            console.log("servẻ vừa nhận đc yêu cầu kết bạn");
            console.log(data); 
           // console.log(socket.request.user) ; 
            let currentUser = {
                id: sender._id,
                username: sender.firstName,
                email: sender.email

            };

            if( clients[data.contactId]){
                emitNotifyToArray(clients, data.contactId, io, "response-add-new-contact", currentUser); 
            }

        }); 

        socket.on("disconnect", () => {
            // remove socketId when socket disconnect
            console.log("add new contact vừa disconect");
            clients = removeSocketIdFromArray(clients,sender._id, socket ); 

        }); 
        //console.log(clients) ; 
        } catch (error) {
            
        }
       
    }) ; 
};

export default addNewContact ; 
