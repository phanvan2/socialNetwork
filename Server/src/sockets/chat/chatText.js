import {
  pushSocketIdToArray,
  emitNotifyToArray,
  removeSocketIdFromArray,
} from "../../helpers/socketHelpers";
import jwt from "jsonwebtoken";

/**
 *
 * @param io from socket.io lib
 */
let chatText = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    try {
      let req_user = socket.handshake.auth.token;
      let sender = jwt.verify(req_user, process.env.JWT_KEY);
      // pussh socket id to array
      clients = pushSocketIdToArray(clients, sender._id, socket.id);

      socket.on("chat-text", (data) => {
        //   if (data.contactId) {
        let response = {
          senderId: sender._id,
          receiverId: data.dataChat.receiverId,
          text: data.dataChat.text,
          messageType: data.dataChat.messageType,
        };
        if (clients[data.dataChat.receiverId]) {
          emitNotifyToArray(
            clients,
            data.dataChat.receiverId,
            io,
            "response-chat-text",
            response
          );
        }
      });

      socket.on("disconnect", () => {
        // remove socketId when socket disconnect

        clients = removeSocketIdFromArray(clients, sender._id, socket);
      });
      //console.log(clients) ;
    } catch (error) {}
  });
};

export default chatText;
