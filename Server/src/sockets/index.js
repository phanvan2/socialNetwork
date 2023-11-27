

import userOfflineOnline from "./status/userOfflineOnline";
import addNewContact from "./contact/addNewContact";
import approveRequestContact from "./contact/approveRequestContact";

/**
 * 
 * @param io from socket.jo library 
 */
let initSockets = (io) => {
   
    userOfflineOnline(io);
    addNewContact(io);
    approveRequestContact(io); 
}

export default initSockets  ; 
