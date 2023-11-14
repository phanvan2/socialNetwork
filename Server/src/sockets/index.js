

import userOfflineOnline from "./status/userOfflineOnline";
import addNewContact from "./contact/addNewContact";


/**
 * 
 * @param io from socket.jo library 
 */
let initSockets = (io) => {
   
    userOfflineOnline(io);
    addNewContact(io);
}

export default initSockets  ; 
