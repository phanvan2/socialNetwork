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

        let req_user = socket.handshake.auth.token;
        let sender = (jwt.verify(req_user, process.env.JWT_KEY));
        clients = pushSocketIdToArray(clients, sender._id, socket.id) ; 

        socket.on("add-new-contact", (data) => { 
            console.log("server nhận đc rùi")
            let newNotification = (data.newNotification) ; 
            console.log(newNotification); 

            if( clients[newNotification.contactId]){
                emitNotifyToArray(clients, newNotification.contactId, io, "response-add-new-contact",newNotification); 
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
