import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "../../helpers/socketHelpers"; 
import jwt from "jsonwebtoken";


/**
 * 
 * @param io from socket.io lib 
 */
let approveRequestContactReceived = (io) => {
    let clients = {} ; 
    io.on("connection", (socket) => {
        try {

            let req_user = socket.handshake.auth.token;
            let sender = (jwt.verify(req_user, process.env.JWT_KEY));
             // pussh socket id to array
            clients = pushSocketIdToArray(clients, sender._id, socket.id) ; 

            socket.on("approve-request-contact-received", (data) => {
                console.log("approve nhận đc io rùi "); 
              console.log(data); 
              let newNotification = (data.newNotification) ; 
              console.log(newNotification); 
  
                if( clients[newNotification.contactId]){
                    emitNotifyToArray(clients, newNotification.contactId, io, "response-approve-request-contact-received", newNotification); 
                }

            }); 

            socket.on("disconnect", () => {
                // remove socketId when socket disconnect

                clients = removeSocketIdFromArray(clients,sender._id, socket ); 

            }); 
            //console.log(clients) ;
        } catch (error) {
            
        }
        
    }) ; 
};

export default approveRequestContactReceived ; 
