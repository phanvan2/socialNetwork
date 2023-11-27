import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "../../helpers/socketHelpers"; 
import jwt from "jsonwebtoken";


/**
 * 
 * @param io from socket.io lib 
 */
let userOfflineOnline = (io) => {
    let clients = {} ; 
    io.on("connection", (socket) => {
        try {
            let req_user = socket.handshake.auth.token;
            let user_id = (jwt.verify(req_user, process.env.JWT_KEY))._id;

            // pussh socket id to array
            clients = pushSocketIdToArray(clients, user_id, socket.id) ; 

            let listUsersOnline = Object.keys(clients);
            //step 01: Emit to user after login or f5 web page
            socket.emit("server-send-list-users-online", listUsersOnline);

            //step 02: Emit to all another users when has new user online
            socket.broadcast.emit("server-send-when-new-user-online", user_id); 
            socket.on("disconnect", () => {
                console.log(`thằng nào vừa disconect`);
                // remove socketId when socket disconnect

                clients = removeSocketIdFromArray(clients,user_id, socket ); 

                // step 03: emit to all another user when  has new user offline
                socket.broadcast.emit("server-send-when-new-user-offline", user_id); 
                console.log(clients); 

            }); 
            console.log("connect khác rùi");
            console.log(clients); 
        } catch (error) {
            
        }
        
    }) ; 
};

export default userOfflineOnline ; 
