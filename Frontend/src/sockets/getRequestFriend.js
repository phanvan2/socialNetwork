import { socketStore } from "../store";


export const getRequestFriend = (socket) => {
    socket.io.on("response-add-new-contact", (idSender)=> {
        console.log("có người vừa gửi keté bạn");
        console.log(idSender);
    });
}

 
